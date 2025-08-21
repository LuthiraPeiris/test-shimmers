import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../lib/lambdaClient";

// GET all certificates with pagination and search
export async function GET(request: Request) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    let query = "SELECT * FROM certification_report";
    let countQuery = "SELECT COUNT(*) as total FROM certification_report";
    const params: any[] = [];
    const countParams: any[] = [];
    
    // Add search filter if provided
    if (search) {
      const searchParam = `%${search}%`;
      query += " WHERE Certificate_Name LIKE ? OR Item_Code LIKE ? OR Item_Name LIKE ?";
      countQuery += " WHERE Certificate_Name LIKE ? OR Item_Code LIKE ? OR Item_Name LIKE ?";
      params.push(searchParam, searchParam, searchParam);
      countParams.push(searchParam, searchParam, searchParam);
    }
    
    // Add pagination
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
    
    // Execute queries using Lambda client
    const [dataResponse, countResponse] = await Promise.all([
      lambdaClient.select(query, params),
      lambdaClient.select(countQuery, countParams)
    ]);

    if (!dataResponse.success || !countResponse.success) {
      throw new Error(dataResponse.error || countResponse.error || 'Failed to fetch data');
    }

    const total = countResponse.data[0].total;
    
    // Format response to match frontend expectations
    const certificates = dataResponse.data.map((row: any) => ({
      regId: row.Reg_Id,
      certificateName: row.Certificate_Name,
      itemCode: row.Item_Code,
      itemName: row.Item_Name,
      expiryDate: row.Expiry_Date
    }));
    
    return NextResponse.json({
      certificates,
      total,
      page,
      limit
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST a new certificate
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Accept both camelCase and PascalCase formats
    const regId = body.regId || body.Reg_Id;
    const certificateName = body.certificateName || body.Certificate_Name;
    const itemCode = body.itemCode || body.Item_Code;
    const itemName = body.itemName || body.Item_Name;
    const expiryDate = body.expiryDate || body.Expiry_Date;

    // Validate required fields
    if (!regId || !certificateName || !itemCode || !itemName || !expiryDate) {
      return NextResponse.json(
        {
          error: "All fields are required",
          received: { regId, certificateName, itemCode, itemName, expiryDate }
        },
        { status: 400 }
      );
    }

    // Insert the data using Lambda client
    const insertResponse = await lambdaClient.insert(
      `INSERT INTO certification_report (Reg_Id, Certificate_Name, Item_Code, Item_Name, Expiry_Date)
       VALUES (?, ?, ?, ?, ?)`,
      [regId, certificateName, itemCode, itemName, expiryDate]
    );

    if (!insertResponse.success) {
      throw new Error(insertResponse.error || 'Failed to create certificate');
    }

    const newCertificate = {
      regId,
      certificateName,
      itemCode,
      itemName,
      expiryDate
    };

    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      {
        error: "Failed to create certificate",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// PUT update certificate
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.regId) {
      return NextResponse.json(
        { error: "Reg_Id is required" },
        { status: 400 }
      );
    }

    // Check if certificate exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [body.regId]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || 'Failed to check certificate existence');
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const existing = existingResponse.data[0];

    // Update the certificate
    const updateResponse = await lambdaClient.update(
      `UPDATE certification_report SET
        Certificate_Name = ?, Item_Code = ?, Item_Name = ?, Expiry_Date = ?
        WHERE Reg_Id = ?`,
      [
        body.certificateName || existing.Certificate_Name,
        body.itemCode || existing.Item_Code,
        body.itemName || existing.Item_Name,
        body.expiryDate || existing.Expiry_Date,
        body.regId,
      ]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || 'Failed to update certificate');
    }

    // Get updated certificate
    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [body.regId]
    );

    if (!updatedResponse.success || updatedResponse.data.length === 0) {
      throw new Error('Failed to fetch updated certificate');
    }

    const updated = updatedResponse.data[0];

    // Return data in the format expected by frontend
    const responseData = {
      regId: updated.Reg_Id,
      certificateName: updated.Certificate_Name,
      itemCode: updated.Item_Code,
      itemName: updated.Item_Name,
      expiryDate: updated.Expiry_Date,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}

// DELETE certificate
export async function DELETE(request: Request) {
  try {
    // Extract Reg_Id from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const regId = pathParts[pathParts.length - 1];

    if (!regId) {
      return NextResponse.json(
        { error: "Reg_Id is required" },
        { status: 400 }
      );
    }

    // Check if certificate exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [regId]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || 'Failed to check certificate existence');
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Delete the certificate
    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM certification_report WHERE Reg_Id = ?",
      [regId]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || 'Failed to delete certificate');
    }

    return NextResponse.json(
      { message: "Certificate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
