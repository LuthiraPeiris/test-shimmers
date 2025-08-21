import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../lib/lambdaClient";

// ✅ GET all suppliers with pagination + optional search
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";

    const offset = (page - 1) * limit;

    let query = "SELECT * FROM supplier_data";
    let countQuery = "SELECT COUNT(*) as total FROM supplier_data";
    const params: any[] = [];
    const countParams: any[] = [];

    if (search || status) {
      const whereClauses: string[] = [];
      if (search) {
        whereClauses.push(
          "(LOWER(Supplier_Name) LIKE LOWER(?) OR LOWER(Email) LIKE LOWER(?) OR LOWER(Country) LIKE LOWER(?) OR LOWER(Phone) LIKE LOWER(?))"
        );
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }
      if (status) {
        whereClauses.push("Status = ?");
        params.push(status);
        countParams.push(status);
      }
      const whereClause = " WHERE " + whereClauses.join(" AND ");
      query += whereClause;
      countQuery += whereClause;
    }

    query += " ORDER BY Supplier_Name ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Run queries via lambdaClient
    const [dataResponse, countResponse] = await Promise.all([
      lambdaClient.select(query, params),
      lambdaClient.select(countQuery, countParams),
    ]);

    if (!dataResponse.success || !countResponse.success) {
      throw new Error(dataResponse.error || countResponse.error || "Failed to fetch suppliers");
    }

    const total = countResponse.data[0].total;

    return NextResponse.json(
      {
        success: true,
        suppliers: dataResponse.data,
        total,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET suppliers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers", success: false },
      { status: 500 }
    );
  }
}

// ✅ POST new supplier
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Supplier_Name, Country, Email, Phone, Address, Status = "Active" } = body;

    if (!Supplier_Name) {
      return NextResponse.json(
        { error: "Supplier_Name is required", success: false },
        { status: 400 }
      );
    }

    if (Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      return NextResponse.json(
        { error: "Invalid email format", success: false },
        { status: 400 }
      );
    }

    // Get latest Supplier_Id
    const lastIdResponse = await lambdaClient.select(
      "SELECT Supplier_Id FROM supplier_data ORDER BY Supplier_Id DESC LIMIT 1",
      []
    );

    if (!lastIdResponse.success) {
      throw new Error(lastIdResponse.error || "Failed to get last Supplier_Id");
    }

    let newSupplierId = "SUP0001";
    if (lastIdResponse.data.length > 0) {
      const lastId = lastIdResponse.data[0].Supplier_Id;
      const numericPart = parseInt(lastId.replace("SUP", ""), 10);
      newSupplierId = `SUP${(numericPart + 1).toString().padStart(4, "0")}`;
    }

    // Insert new supplier
    const insertResponse = await lambdaClient.insert(
      `INSERT INTO supplier_data
       (Supplier_Id, Supplier_Name, Country, Email, Phone, Address, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newSupplierId,
        Supplier_Name,
        Country || null,
        Email || null,
        Phone || null,
        Address || null,
        Status,
      ]
    );

    if (!insertResponse.success) {
      throw new Error(insertResponse.error || "Failed to create supplier");
    }

    return NextResponse.json(
      {
        message: "Supplier created successfully",
        Supplier_Id: newSupplierId,
        Supplier_Name,
        Country,
        Email,
        Phone,
        Address,
        Status,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST supplier error:", error);
    return NextResponse.json(
      { error: "Failed to create supplier", success: false },
      { status: 500 }
    );
  }
}

// ✅ PUT update supplier
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.Supplier_Id) {
      return NextResponse.json(
        { error: "Supplier_Id is required", success: false },
        { status: 400 }
      );
    }

    // Check existing supplier
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [body.Supplier_Id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check supplier existence");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Supplier not found", success: false },
        { status: 404 }
      );
    }

    const existing = existingResponse.data[0];

    // Update supplier
    const updateResponse = await lambdaClient.update(
      `UPDATE supplier_data
       SET Supplier_Name = ?, Country = ?, Email = ?, Phone = ?, Address = ?, Status = ?
       WHERE Supplier_Id = ?`,
      [
        body.Supplier_Name || existing.Supplier_Name,
        body.Country || existing.Country,
        body.Email || existing.Email,
        body.Phone || existing.Phone,
        body.Address || existing.Address,
        body.Status || existing.Status,
        body.Supplier_Id,
      ]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || "Failed to update supplier");
    }

    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [body.Supplier_Id]
    );

    return NextResponse.json(
      { success: true, supplier: updatedResponse.data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT supplier error:", error);
    return NextResponse.json(
      { error: "Failed to update supplier", success: false },
      { status: 500 }
    );
  }
}

// ✅ DELETE supplier
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const Supplier_Id = url.searchParams.get("Supplier_Id");

    if (!Supplier_Id) {
      return NextResponse.json(
        { error: "Supplier_Id is required", success: false },
        { status: 400 }
      );
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [Supplier_Id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check supplier existence");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Supplier not found", success: false },
        { status: 404 }
      );
    }

    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM supplier_data WHERE Supplier_Id = ?",
      [Supplier_Id]
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
    return NextResponse.json(
      { error: "Failed to delete supplier", success: false },
      { status: 500 }
    );
  }
}
