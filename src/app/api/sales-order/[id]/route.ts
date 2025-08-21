import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET a sales order by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Sales order ID is required", success: false }, { status: 400 });
    }

    // Fetch sales order
    const orderResponse = await lambdaClient.select(
      "SELECT * FROM sales_orders WHERE Sales_Order_ID = ?",
      [id]
    );

    if (!orderResponse.success) {
      throw new Error(orderResponse.error || "Failed to fetch sales order");
    }

    if (orderResponse.data.length === 0) {
      return NextResponse.json({ error: "Sales order not found", success: false }, { status: 404 });
    }

    const order = orderResponse.data[0];

    // Fetch items
    const itemsResponse = await lambdaClient.select(
      "SELECT * FROM sales_order_items WHERE Sales_Order_ID = ?",
      [id]
    );

    const items = itemsResponse.success ? itemsResponse.data : [];

    return NextResponse.json(
      { ...order, items, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET sales order error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}

// ✅ PUT (update) a sales order by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Sales order ID is required", success: false }, { status: 400 });
    }

    // Fetch existing sales order
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM sales_orders WHERE Sales_Order_ID = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to fetch sales order");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Sales order not found", success: false }, { status: 404 });
    }

    const existing = existingResponse.data[0];

    // Validate and prepare updated fields
    const updatedFields = {
      Customer_ID: body.Customer_ID ?? existing.Customer_ID,
      Customer_Name: body.Customer_Name ?? existing.Customer_Name,
      Customer_Address: body.Customer_Address ?? existing.Customer_Address,
      Customer_Phone: body.Customer_Phone ?? existing.Customer_Phone,
      Order_Date: body.Order_Date ?? existing.Order_Date,
      Delivery_Date: body.Delivery_Date ?? existing.Delivery_Date,
      Payment_Terms: body.Payment_Terms ?? existing.Payment_Terms,
      Total_Amount: body.Total_Amount ?? existing.Total_Amount,
      Tax_Amount: body.Tax_Amount ?? existing.Tax_Amount,
      Discount_Amount: body.Discount_Amount ?? existing.Discount_Amount,
      Net_Amount: body.Net_Amount ?? existing.Net_Amount,
      Status: body.Status ?? existing.Status,
      Remarks: body.Remarks ?? existing.Remarks,
      User_ID: body.User_ID ?? existing.User_ID,
    };

    // Update sales order
    const updateOrderResponse = await lambdaClient.update(
      `UPDATE sales_orders SET 
        Customer_ID = ?, Customer_Name = ?, Customer_Address = ?, Customer_Phone = ?, 
        Order_Date = ?, Delivery_Date = ?, Payment_Terms = ?, Total_Amount = ?, 
        Tax_Amount = ?, Discount_Amount = ?, Net_Amount = ?, Status = ?, Remarks = ?, User_ID = ? 
      WHERE Sales_Order_ID = ?`,
      [
        updatedFields.Customer_ID,
        updatedFields.Customer_Name,
        updatedFields.Customer_Address,
        updatedFields.Customer_Phone,
        updatedFields.Order_Date,
        updatedFields.Delivery_Date,
        updatedFields.Payment_Terms,
        updatedFields.Total_Amount,
        updatedFields.Tax_Amount,
        updatedFields.Discount_Amount,
        updatedFields.Net_Amount,
        updatedFields.Status,
        updatedFields.Remarks,
        updatedFields.User_ID,
        id
      ]
    );

    if (!updateOrderResponse.success) {
      throw new Error(updateOrderResponse.error || "Failed to update sales order");
    }

    // Delete existing items
    await lambdaClient.delete(
      "DELETE FROM sales_order_items WHERE Sales_Order_ID = ?",
      [id]
    );

    // Insert new items
    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        await lambdaClient.insert(
          `INSERT INTO sales_order_items 
            (Sales_Order_ID, Item_Code, Item_Name, Quantity, Unit_Price, Total_Price, Remarks)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            item.Item_Code ?? '',
            item.Item_Name ?? '',
            item.Quantity ?? 0,
            item.Unit_Price ?? 0,
            item.Total_Price ?? 0,
            item.Remarks ?? ''
          ]
        );
      }
    }

    return NextResponse.json({ message: "Sales order updated successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("PUT sales order error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}

// ✅ DELETE a sales order by ID
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Sales order ID is required", success: false }, { status: 400 });
    }

    // Delete items first
    await lambdaClient.delete(
      "DELETE FROM sales_order_items WHERE Sales_Order_ID = ?",
      [id]
    );

    // Delete sales order
    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM sales_orders WHERE Sales_Order_ID = ?",
      [id]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || "Failed to delete sales order");
    }

    return NextResponse.json({ message: "Sales order deleted successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE sales order error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
