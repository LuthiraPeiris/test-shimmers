import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter"; 
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const pool = await getDBConnection();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate date range params if only one is provided
    if ((startDate && !endDate) || (!startDate && endDate)) {
      return NextResponse.json(
        { error: "Both startDate and endDate must be provided" },
        { status: 400 }
      );
    }

    // Base query
    let query = `SELECT * FROM return_orders`;
    const params: any[] = [];

    // Apply date filter if both dates provided
    if (startDate && endDate) {
      query += ` WHERE Return_Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    // Execute query
    const [rows] = await pool.query(query, params);

    return NextResponse.json(
      { success: true, data: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching return orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch return orders" },
      { status: 500 }
    );
  }
}
