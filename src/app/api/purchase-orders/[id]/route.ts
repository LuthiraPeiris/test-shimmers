import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET a purchase order by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Purchase order ID is required", success: false }, { status: 400 });
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM purchase_order WHERE Po_Id = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to fetch purchase order");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Purchase order not found", success: false }, { status: 404 });
    }

    const order = existingResponse.data[0];

    return NextResponse.json(
      {
        po_id: order.Po_Id,
        created_date: order.Created_Date,
        location: order.Location,
        supplier_id: order.Supplier_Id,
        supplier_name: order.Supplier_Name,
        item_code: order.Item_Code,
        item_name: order.Item_Name,
        price: order.Price,
        quantity: order.Quantity,
        dis_value: order.DisValue,
        tot_value: order.TotValue,
        status: order.Status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET purchase order error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}

// ✅ PUT (update) a purchase order by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Purchase order ID is required", success: false }, { status: 400 });
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM purchase_order WHERE Po_Id = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to fetch purchase order");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Purchase order not found", success: false }, { status: 404 });
    }

    const existing = existingResponse.data[0];

    // Prepare updated values
    const updatedFields: any = {
      Created_Date: body.Created_Date ?? existing.Created_Date,
      Location: body.Location ?? existing.Location,
      Supplier_Id: body.Supplier_Id ?? existing.Supplier_Id,
      Supplier_Name: body.Supplier_Name ?? existing.Supplier_Name,
      Item_Code: body.Item_Code ?? existing.Item_Code,
      Item_Name: body.Item_Name ?? existing.Item_Name,
      Price: body.Price ?? existing.Price,
      Quantity: body.Quantity ?? existing.Quantity,
      DisValue: body.DisValue ?? existing.DisValue,
      Status: body.Status ?? existing.Status,
    };

    updatedFields.TotValue = (updatedFields.Price * updatedFields.Quantity) - updatedFields.DisValue;

    const updateResponse = await lambdaClient.update(
      `UPDATE purchase_order SET 
        Created_Date = ?, Location = ?, Supplier_Id = ?, Supplier_Name = ?, 
        Item_Code = ?, Item_Name = ?, Price = ?, Quantity = ?, DisValue = ?, TotValue = ?, Status = ?
       WHERE Po_Id = ?`,
      [
        updatedFields.Created_Date,
        updatedFields.Location,
        updatedFields.Supplier_Id,
        updatedFields.Supplier_Name,
        updatedFields.Item_Code,
        updatedFields.Item_Name,
        updatedFields.Price,
        updatedFields.Quantity,
        updatedFields.DisValue,
        updatedFields.TotValue,
        updatedFields.Status,
        id,
      ]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || "Failed to update purchase order");
    }

    const updatedRecord = await lambdaClient.select(
      "SELECT * FROM purchase_order WHERE Po_Id = ?",
      [id]
    );

    const updated = updatedRecord.data[0];

    return NextResponse.json(
      {
        po_id: updated.Po_Id,
        created_date: updated.Created_Date,
        location: updated.Location,
        supplier_id: updated.Supplier_Id,
        supplier_name: updated.Supplier_Name,
        item_code: updated.Item_Code,
        item_name: updated.Item_Name,
        price: updated.Price,
        quantity: updated.Quantity,
        dis_value: updated.DisValue,
        tot_value: updated.TotValue,
        status: updated.Status,
        message: "Purchase order updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT purchase order error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}

// ✅ DELETE a purchase order by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Purchase order ID is required", success: false }, { status: 400 });
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM purchase_order WHERE Po_Id = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to fetch purchase order");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Purchase order not found", success: false }, { status: 404 });
    }

    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM purchase_order WHERE Po_Id = ?",
      [id]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || "Failed to delete purchase order");
    }

    return NextResponse.json(
      { message: "Purchase order deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE purchase order error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
