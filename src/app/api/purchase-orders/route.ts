import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/dbAdapter";

// GET /api/purchase-orders
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") || "").toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const status = searchParams.get("status");
  const supplierId = searchParams.get("supplier_id");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  try {
    const db = await getDBConnection();
    
    let query = "SELECT * FROM purchase_order WHERE 1=1";
    const queryParams: any[] = [];

    // Search functionality
    if (search) {
      query += ` AND (LOWER(po_id) LIKE ? OR LOWER(supplier_name) LIKE ? OR LOWER(item_name) LIKE ? OR LOWER(status) LIKE ?)`;
      const keyword = `%${search}%`;
      queryParams.push(keyword, keyword, keyword, keyword);
    }

    // Filters
    if (status) {
      query += " AND status = ?";
      queryParams.push(status);
    }
    if (supplierId) {
      query += " AND supplier_id = ?";
      queryParams.push(supplierId);
    }
    if (dateFrom) {
      query += " AND created_date >= ?";
      queryParams.push(dateFrom);
    }
    if (dateTo) {
      query += " AND created_date <= ?";
      queryParams.push(dateTo);
    }

    // Get total count for pagination
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const countResult = await db.execute(countQuery, queryParams);
    
    // Extract total from the response
    let total = 0;
    if (countResult && Array.isArray(countResult[0]) && countResult[0].length > 0) {
      total = countResult[0][0].total || 0;
    }

    // Pagination
    const offset = (page - 1) * limit;
    query += " ORDER BY created_date DESC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    const [rows] = await db.query(query, queryParams);

    return NextResponse.json({
      success: true,
      purchaseOrders: rows || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch purchase orders", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/purchase-orders
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDBConnection();

    const {
      Created_Date,
      Location,
      Supplier_Id,
      Supplier_Name,
      Item_Code,
      Item_Name,
      Price,
      Quantity,
      DisValue = 0,
      Status = "Pending"
    } = body;

    // Generate new Po_Id
    const [rows] = await db.query(
      `SELECT Po_Id FROM purchase_order ORDER BY Po_Id DESC LIMIT 1`
    );

    let newPoId = "P0001";
    if (rows && Array.isArray(rows) && rows.length > 0) {
      const lastPoId = rows[0].Po_Id;
      const numericPart = parseInt(lastPoId.replace("P", ""), 10);
      newPoId = `P${(numericPart + 1).toString().padStart(4, "0")}`;
    }

    const TotValue = (Price * Quantity) - DisValue;

    const result = await db.execute(
      `INSERT INTO purchase_order 
        (Po_Id, Created_Date, Location, Supplier_Id, Supplier_Name, Item_Code, Item_Name, Price, Quantity, DisValue, TotValue, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newPoId,
        Created_Date || new Date().toISOString().split('T')[0],
        Location || null,
        Supplier_Id,
        Supplier_Name || null,
        Item_Code,
        Item_Name || null,
        Price,
        Quantity,
        DisValue,
        TotValue,
        Status
      ]
    );

    return NextResponse.json(
      {
        success: true,
        data: { ...body, Po_Id: newPoId, TotValue, Status },
        message: "Purchase order created successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to insert purchase order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create purchase order" },
      { status: 500 }
    );
  }
}
