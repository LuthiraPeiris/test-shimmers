import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../lib/lambdaClient";

// ✅ GET all customers with pagination + optional search
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    let query = "SELECT * FROM customer_data";
    let countQuery = "SELECT COUNT(*) as total FROM customer_data";
    const params: any[] = [];
    const countParams: any[] = [];

    if (search) {
      const searchParam = `%${search}%`;
      query += " WHERE Name LIKE ? OR Customer_ID LIKE ?";
      countQuery += " WHERE Name LIKE ? OR Customer_ID LIKE ?";
      params.push(searchParam, searchParam);
      countParams.push(searchParam, searchParam);
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Run queries
    const [dataResponse, countResponse] = await Promise.all([
      lambdaClient.select(query, params),
      lambdaClient.select(countQuery, countParams),
    ]);

    if (!dataResponse.success || !countResponse.success) {
      throw new Error(
        dataResponse.error || countResponse.error || "Failed to fetch customers"
      );
    }

    const total = countResponse.data[0].total;
    const customers = dataResponse.data.map((row: any) => ({
      Customer_ID: row.Customer_ID,
      Name: row.Name,
      Email: row.Email,
      Phone: row.Phone,
      Address: row.Address,
    }));

    return NextResponse.json(
      {
        success: true,
        customers,
        total,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers", success: false },
      { status: 500 }
    );
  }
}

// ✅ POST new customer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Name, Email, Phone, Address } = body;

    if (!Name) {
      return NextResponse.json(
        { error: "Name is required", success: false },
        { status: 400 }
      );
    }

    // Get latest Customer_ID
    const lastIdResponse = await lambdaClient.select(
      "SELECT Customer_ID FROM customer_data ORDER BY Customer_ID DESC LIMIT 1",
      []
    );

    if (!lastIdResponse.success) {
      throw new Error(lastIdResponse.error || "Failed to get last customer ID");
    }

    let newCustomerId = "CU0001";
    if (lastIdResponse.data.length > 0) {
      const lastId = lastIdResponse.data[0].Customer_ID;
      const numericPart = parseInt(lastId.replace("CU", ""), 10);
      const nextNumber = numericPart + 1;
      newCustomerId = `CU${nextNumber.toString().padStart(4, "0")}`;
    }

    // Insert new customer
    const insertResponse = await lambdaClient.insert(
      `INSERT INTO customer_data (Customer_ID, Name, Email, Phone, Address)
       VALUES (?, ?, ?, ?, ?)`,
      [newCustomerId, Name, Email || null, Phone || null, Address || null]
    );

    if (!insertResponse.success) {
      throw new Error(insertResponse.error || "Failed to create customer");
    }

    return NextResponse.json(
      {
        message: "Customer created successfully",
        Customer_ID: newCustomerId,
        Name,
        Email,
        Phone,
        Address,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create customer", success: false },
      { status: 500 }
    );
  }
}

// ✅ PUT update customer
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.Customer_ID) {
      return NextResponse.json(
        { error: "Customer_ID is required", success: false },
        { status: 400 }
      );
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [body.Customer_ID]
    );

    if (!existingResponse.success) {
      throw new Error(
        existingResponse.error || "Failed to check customer existence"
      );
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Customer not found", success: false },
        { status: 404 }
      );
    }

    const existing = existingResponse.data[0];

    const updateResponse = await lambdaClient.update(
      `UPDATE customer_data
       SET Name = ?, Email = ?, Phone = ?, Address = ?
       WHERE Customer_ID = ?`,
      [
        body.Name || existing.Name,
        body.Email || existing.Email,
        body.Phone || existing.Phone,
        body.Address || existing.Address,
        body.Customer_ID,
      ]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || "Failed to update customer");
    }

    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [body.Customer_ID]
    );

    if (!updatedResponse.success || updatedResponse.data.length === 0) {
      throw new Error("Failed to fetch updated customer");
    }

    return NextResponse.json(
      { success: true, customer: updatedResponse.data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update customer", success: false },
      { status: 500 }
    );
  }
}

// ✅ DELETE customer
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const Customer_ID = url.searchParams.get("Customer_ID");

    if (!Customer_ID) {
      return NextResponse.json(
        { error: "Customer_ID is required", success: false },
        { status: 400 }
      );
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [Customer_ID]
    );

    if (!existingResponse.success) {
      throw new Error(
        existingResponse.error || "Failed to check customer existence"
      );
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Customer not found", success: false },
        { status: 404 }
      );
    }

    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM customer_data WHERE Customer_ID = ?",
      [Customer_ID]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || "Failed to delete customer");
    }

    return NextResponse.json(
      { message: "Customer deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete customer", success: false },
      { status: 500 }
    );
  }
}
