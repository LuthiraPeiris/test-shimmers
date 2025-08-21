import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET a supplier by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Supplier ID is required", success: false }, { status: 400 });
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to fetch supplier");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Supplier not found", success: false }, { status: 404 });
    }

    const supplier = existingResponse.data[0];

    return NextResponse.json(
      {
        Supplier_Id: supplier.Supplier_Id,
        Supplier_Name: supplier.Supplier_Name,
        Country: supplier.Country,
        Email: supplier.Email,
        Phone: supplier.Phone,
        Address: supplier.Address,
        Status: supplier.Status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET supplier error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}

// ✅ PUT (update) a supplier by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updatedData = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Supplier ID is required", success: false }, { status: 400 });
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check supplier existence");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Supplier not found", success: false }, { status: 404 });
    }

    const existing = existingResponse.data[0];

    const updateResponse = await lambdaClient.update(
      `UPDATE supplier_data
       SET Supplier_Name = ?, Country = ?, Email = ?, Phone = ?, Address = ?, Status = ?
       WHERE Supplier_Id = ?`,
      [
        updatedData.supplier_name || updatedData.Supplier_Name || existing.Supplier_Name,
        updatedData.country || updatedData.Country || existing.Country,
        updatedData.email || updatedData.Email || existing.Email,
        updatedData.phone || updatedData.Phone || existing.Phone,
        updatedData.address || updatedData.Address || existing.Address,
        updatedData.status || updatedData.Status || existing.Status,
        id,
      ]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || "Failed to update supplier");
    }

    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [id]
    );

    const updated = updatedResponse.data[0];

    return NextResponse.json(
      {
        Supplier_Id: updated.Supplier_Id,
        Supplier_Name: updated.Supplier_Name,
        Country: updated.Country,
        Email: updated.Email,
        Phone: updated.Phone,
        Address: updated.Address,
        Status: updated.Status,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT supplier error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}

// ✅ DELETE a supplier by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Supplier ID is required", success: false }, { status: 400 });
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check supplier existence");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Supplier not found", success: false }, { status: 404 });
    }

    // Delete supplier
    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM supplier_data WHERE Supplier_Id = ?",
      [id]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || "Failed to delete supplier");
    }

    return NextResponse.json(
      { message: "Supplier deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE supplier error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
