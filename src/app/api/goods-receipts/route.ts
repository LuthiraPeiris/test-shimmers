import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../lib/lambdaClient";

// ✅ GET goods receipts (with search)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").toLowerCase();

    let query = "SELECT * FROM good_receipts_data";
    const queryParams: any[] = [];

    if (search) {
      query += " WHERE (GRN_ID LIKE ? OR Po_Id LIKE ? OR Item_Code LIKE ? OR Status LIKE ?)";
      const searchParam = `%${search}%`;
      queryParams.push(searchParam, searchParam, searchParam, searchParam);
    }

    const response = await lambdaClient.select(query, queryParams);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch goods receipts");
    }

    return NextResponse.json(
      { success: true, goodsReceipts: response.data || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching goods receipts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch goods receipts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// ✅ POST goods receipt (insert + update stock)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      Po_Id,
      Item_Code,
      Item_Name,
      Quantity,
      Unit_Price,
      Total_Amount,
      MF_Date,
      Status,
      Ex_Date,
    } = body;

    // Validate input
    if (
      !Po_Id ||
      !Item_Code ||
      !Item_Name ||
      !Quantity ||
      !Unit_Price ||
      !Total_Amount ||
      !MF_Date ||
      !Status ||
      !Ex_Date
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const parsedQuantity = parseInt(Quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Quantity must be a valid positive number" },
        { status: 400 }
      );
    }

    // ✅ Check item exists in inventory
    const productRes = await lambdaClient.select(
      "SELECT Available_Stock FROM item_master_data WHERE Item_Code = ?",
      [Item_Code]
    );

    if (!productRes.success) {
      throw new Error(productRes.error || "Failed to check inventory");
    }

    if (productRes.data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Item not found in inventory" },
        { status: 404 }
      );
    }

    // ✅ Generate GRN_ID
    let GRN_ID = "GR0001";
    const lastIdRes = await lambdaClient.select(
      "SELECT GRN_ID FROM good_receipts_data ORDER BY GRN_ID DESC LIMIT 1",
      []
    );

    if (!lastIdRes.success) {
      throw new Error(lastIdRes.error || "Failed to get last GRN_ID");
    }

    if (lastIdRes.data.length > 0) {
      const lastId = lastIdRes.data[0].GRN_ID;
      const numericPart = parseInt(lastId.replace("GR", ""), 10);
      GRN_ID = `GR${(numericPart + 1).toString().padStart(4, "0")}`;
    }

    // ✅ Insert goods receipt
    const insertRes = await lambdaClient.insert(
      `INSERT INTO good_receipts_data 
        (GRN_ID, Po_Id, Item_Code, Item_Name, Quantity, Unit_Price, Total_Amount, MF_Date, Status, Ex_Date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        GRN_ID,
        Po_Id,
        Item_Code,
        Item_Name,
        parsedQuantity,
        Unit_Price,
        Total_Amount,
        MF_Date,
        Status,
        Ex_Date,
      ]
    );

    if (!insertRes.success) {
      throw new Error(insertRes.error || "Failed to insert goods receipt");
    }

    // ✅ Update stock
    const updateRes = await lambdaClient.update(
      "UPDATE item_master_data SET Available_Stock = Available_Stock + ? WHERE Item_Code = ?",
      [parsedQuantity, Item_Code]
    );

    if (!updateRes.success) {
      throw new Error(updateRes.error || "Failed to update inventory stock");
    }

    // ✅ Fetch new record
    const newRecordRes = await lambdaClient.select(
      "SELECT * FROM good_receipts_data WHERE GRN_ID = ?",
      [GRN_ID]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Goods receipt created and inventory updated",
        goodsReceipt: newRecordRes.data[0],
        updatedProduct: {
          Item_Code,
          quantityIncreased: parsedQuantity,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating goods receipt:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create goods receipt",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
