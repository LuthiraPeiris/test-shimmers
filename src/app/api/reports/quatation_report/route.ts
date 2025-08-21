import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter"; 

// GET quotations with optional date range, status, and search
export async function GET(req :Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = `SELECT * FROM quatation_data`;
    const params = [];
    const conditions = [];

    if (startDate && endDate) {
      conditions.push(`Date_Created BETWEEN ? AND ?`);
      params.push(startDate, endDate);
    }

    if (status && status !== 'all') {
      conditions.push(`Status = ?`);
      params.push(status);
    }

    if (search) {
      conditions.push(`(
        Quotation_ID LIKE ? OR 
        Customer_Name LIKE ? OR 
        Item_Name LIKE ? OR 
        Status LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}

