import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET a supplier invoice by In_No
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Supplier invoice ID is required", supplierInvoice: null, success: false }, { status: 400 });
    }

    const response = await lambdaClient.select(
      "SELECT * FROM supplier_invoice_data WHERE In_No = ?",
      [id]
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch supplier invoice");
    }

    if (response.data.length === 0) {
      return NextResponse.json({ error: "Supplier invoice not found", supplierInvoice: null, success: false }, { status: 404 });
    }

    return NextResponse.json({ supplierInvoice: response.data[0], success: true }, { status: 200 });
  } catch (error) {
    console.error("GET supplier invoice error:", error);
    return NextResponse.json({ error: "Internal server error", supplierInvoice: null, success: false }, { status: 500 });
  }
}

// ✅ PUT (update) a supplier invoice by In_No
export async function PUT(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await _.json();

    if (!id) {
      return NextResponse.json({ error: "Supplier invoice ID is required", supplierInvoice: null, success: false }, { status: 400 });
    }

    // Check if invoice exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM supplier_invoice_data WHERE In_No = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check invoice existence");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Supplier invoice not found", supplierInvoice: null, success: false }, { status: 404 });
    }

    const existing = existingResponse.data[0];

    // Build dynamic update
    const fields: string[] = [];
    const values: any[] = [];

    const updatableFields = [
      "Po_Id",
      "Supplier_Id",
      "Supplier_Name",
      "Item_Code",
      "Item_Name",
      "Pack_Size",
      "Total_Amount",
      "Status",
      "Created_Date"
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields provided to update", supplierInvoice: null, success: false }, { status: 400 });
    }

    values.push(id);

    const updateResponse = await lambdaClient.update(
      `UPDATE supplier_invoice_data SET ${fields.join(", ")} WHERE In_No = ?`,
      values
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || "Failed to update supplier invoice");
    }

    // Fetch updated invoice
    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM supplier_invoice_data WHERE In_No = ?",
      [id]
    );

    if (!updatedResponse.success || updatedResponse.data.length === 0) {
      throw new Error("Failed to fetch updated supplier invoice");
    }

    return NextResponse.json({ supplierInvoice: updatedResponse.data[0], success: true }, { status: 200 });
  } catch (error) {
    console.error("PUT supplier invoice error:", error);
    return NextResponse.json({ error: "Internal server error", supplierInvoice: null, success: false }, { status: 500 });
  }
}

// ✅ DELETE a supplier invoice by In_No
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Supplier invoice ID is required", success: false }, { status: 400 });
    }

    // Check if invoice exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM supplier_invoice_data WHERE In_No = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check invoice existence");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Supplier invoice not found", success: false }, { status: 404 });
    }

    // Delete invoice
    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM supplier_invoice_data WHERE In_No = ?",
      [id]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || "Failed to delete supplier invoice");
    }

    return NextResponse.json({ message: "Supplier invoice deleted successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE supplier invoice error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
