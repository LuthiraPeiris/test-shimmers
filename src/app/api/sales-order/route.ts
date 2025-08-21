import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../lib/lambdaClient";

// ✅ GET all sales orders with pagination + optional search
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    let query = "SELECT * FROM sales_orders";
    let countQuery = "SELECT COUNT(*) as total FROM sales_orders";
    const params: any[] = [];
    const countParams: any[] = [];

    if (search) {
      const searchParam = `%${search}%`;
      query += " WHERE Customer_Name LIKE ? OR Sales_Order_ID LIKE ?";
      countQuery += " WHERE Customer_Name LIKE ? OR Sales_Order_ID LIKE ?";
      params.push(searchParam, searchParam);
      countParams.push(searchParam, searchParam);
    }

    query += " ORDER BY Order_Date DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Run queries
    const [dataResponse, countResponse] = await Promise.all([
      lambdaClient.select(query, params),
      lambdaClient.select(countQuery, countParams),
    ]);

    if (!dataResponse.success || !countResponse.success) {
      throw new Error(
        dataResponse.error || countResponse.error || "Failed to fetch sales orders"
      );
    }

    const total = countResponse.data[0].total;
    const salesOrders = dataResponse.data;

    return NextResponse.json(
      {
        success: true,
        salesOrders,
        total,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET sales orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales orders", success: false },
      { status: 500 }
    );
  }
}

// ✅ POST new sales order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requiredFields = ["Customer_ID", "Customer_Name", "Order_Date", "items"];
    const missingFields = requiredFields.filter((f) => !body[f]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields", missingFields },
        { status: 400 }
      );
    }

    const {
      Customer_ID,
      Customer_Name,
      Customer_Address = "",
      Customer_Phone = "",
      Order_Date,
      Delivery_Date = null,
      Payment_Terms = "Net 30",
      Status = "Pending",
      Remarks = "",
      Discount_Amount = 0,
      items = [],
      User_ID = 1,
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one item is required" },
        { status: 400 }
      );
    }

    // 🔹 Generate next Sales_Order_ID
    const lastIdResponse = await lambdaClient.select(
      "SELECT Sales_Order_ID FROM sales_orders ORDER BY Sales_Order_ID DESC LIMIT 1",
      []
    );

    if (!lastIdResponse.success) {
      throw new Error(lastIdResponse.error || "Failed to get last Sales_Order_ID");
    }

    let Sales_Order_ID = "SO0001";
    if (lastIdResponse.data.length > 0) {
      const lastId = lastIdResponse.data[0].Sales_Order_ID;
      const numeric = parseInt(lastId.replace("SO", ""), 10);
      Sales_Order_ID = "SO" + String(numeric + 1).padStart(4, "0");
    }

    // Totals
    const subtotal = items.reduce(
      (sum: number, item: any) =>
        sum + (parseFloat(item.Quantity) * parseFloat(item.Unit_Price)),
      0
    );
    const discount = parseFloat(Discount_Amount) || 0;
    const taxableAmount = Math.max(subtotal - discount, 0);
    const tax = taxableAmount * 0.1;
    const netAmount = taxableAmount + tax;
    const totalAmount = subtotal;

    // Insert sales order
    const insertOrder = await lambdaClient.insert(
      `INSERT INTO sales_orders 
      (Sales_Order_ID, Customer_ID, Customer_Name, Customer_Address, Customer_Phone, 
       Order_Date, Delivery_Date, Payment_Terms, Status, Remarks, 
       Discount_Amount, Total_Amount, Tax_Amount, Net_Amount, User_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Sales_Order_ID,
        Customer_ID,
        Customer_Name,
        Customer_Address,
        Customer_Phone,
        Order_Date,
        Delivery_Date,
        Payment_Terms,
        Status,
        Remarks,
        discount,
        totalAmount,
        tax,
        netAmount,
        User_ID,
      ]
    );

    if (!insertOrder.success) {
      throw new Error(insertOrder.error || "Failed to insert sales order");
    }

    // Insert sales order items
    for (const item of items) {
      if (!item.Item_Code || !item.Item_Name) {
        return NextResponse.json(
          { success: false, error: "Item Code and Item Name are required for each item" },
          { status: 400 }
        );
      }

      const insertItem = await lambdaClient.insert(
        `INSERT INTO sales_order_items 
        (Sales_Order_ID, Item_Code, Item_Name, Quantity, Unit_Price, Total_Price, Remarks) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          Sales_Order_ID,
          item.Item_Code,
          item.Item_Name,
          parseFloat(item.Quantity) || 0,
          parseFloat(item.Unit_Price) || 0,
          parseFloat(item.Total_Price) ||
            parseFloat(item.Quantity) * parseFloat(item.Unit_Price),
          item.Remarks || "",
        ]
      );

      if (!insertItem.success) {
        throw new Error(insertItem.error || "Failed to insert sales order item");
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Sales order created successfully",
        Sales_Order_ID,
        data: {
          Sales_Order_ID,
          Customer_ID,
          Customer_Name,
          Total_Amount: totalAmount,
          Net_Amount: netAmount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST sales order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create sales order",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
