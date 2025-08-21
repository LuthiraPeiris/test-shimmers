import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET a customer by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Check if customer exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to fetch customer");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const customer = existingResponse.data[0];

    return NextResponse.json(
      {
        customer_id: customer.Customer_ID,
        customer_name: customer.Name,
        customer_address: customer.Address,
        email: customer.Email,
        phone: customer.Phone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ PUT (Update) a customer by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updatedData = await req.json();

    // Check if customer exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check customer existence");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const existing = existingResponse.data[0];

    // Update customer
    const updateResponse = await lambdaClient.update(
      `UPDATE customer_data 
       SET Name = ?, Email = ?, Phone = ?, Address = ? 
       WHERE Customer_ID = ?`,
      [
        updatedData.name || existing.Name,
        updatedData.email || existing.Email,
        updatedData.phone || existing.Phone,
        updatedData.address || existing.Address,
        id,
      ]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || "Failed to update customer");
    }

    // Fetch updated record
    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [id]
    );

    if (!updatedResponse.success || updatedResponse.data.length === 0) {
      throw new Error("Failed to fetch updated customer");
    }

    const updated = updatedResponse.data[0];

    return NextResponse.json(
      {
        customer_id: updated.Customer_ID,
        customer_name: updated.Name,
        customer_address: updated.Address,
        email: updated.Email,
        phone: updated.Phone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ DELETE a customer by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Check if customer exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check customer existence");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Delete customer
    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM customer_data WHERE Customer_ID = ?",
      [id]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || "Failed to delete customer");
    }

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
