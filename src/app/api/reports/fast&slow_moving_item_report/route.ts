import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET item movement reports with optional date filter + pagination
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const offset = (page - 1) * limit;

    // Modified query to be less restrictive - using LEFT JOIN instead of INNER JOIN
    let query = `
      SELECT 
        imr.Report_Id,
        imr.Item_Code,
        COALESCE(d.Deliver_Id, 'N/A') as Deliver_Id,
        imr.Item_Name,
        imr.Total_Movement,
        imr.Last_Movement_Date,
        imr.Days_Since_Movement,
        imr.Category,
        imr.Report_Date
      FROM item_movement_report imr
      LEFT JOIN deliver_data d 
        ON imr.Item_Code = d.Item_Code
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM item_movement_report imr
    `;

    const params: any[] = [];
    const countParams: any[] = [];

    if (startDate && endDate) {
      query += ` WHERE imr.Report_Date BETWEEN ? AND ?`;
      countQuery += ` WHERE imr.Report_Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
      countParams.push(startDate, endDate);
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [dataResponse, countResponse] = await Promise.all([
      lambdaClient.select(query, params),
      lambdaClient.select(countQuery, countParams),
    ]);

    if (!dataResponse.success || !countResponse.success) {
      throw new Error(dataResponse.error || countResponse.error || "Failed to fetch reports");
    }

    const total = countResponse.data[0]?.total || 0;
    const reports = dataResponse.data.map((row: any) => ({
      Report_Id: row.Report_Id,
      Item_Code: row.Item_Code,
      Deliver_Id: row.Deliver_Id,
      Item_Name: row.Item_Name,
      Total_Movement: row.Total_Movement,
      Last_Movement_Date: row.Last_Movement_Date,
      Days_Since_Movement: row.Days_Since_Movement,
      Category: row.Category,
      Report_Date: row.Report_Date,
    }));

    return NextResponse.json(
      { 
        success: true, 
        reports, 
        total, 
        page, 
        limit,
        message: total === 0 ? "No data found. Please check if item_movement_report table has data." : undefined
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reports", success: false }, { status: 500 });
  }
}

// ✅ POST: Insert new item movement report
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      Report_Id,
      Item_Code,
      Deliver_Id,
      Item_Name,
      Total_Movement,
      Last_Movement_Date,
      Days_Since_Movement,
      Category,
      Report_Date,
    } = body;

    if (!Report_Id || !Item_Code || !Item_Name || !Report_Date) {
      return NextResponse.json(
        { error: "Required fields missing", success: false },
        { status: 400 }
      );
    }

    const insertResponse = await lambdaClient.insert(
      `
      INSERT INTO item_movement_report 
      (Report_Id, Item_Code, Deliver_Id, Item_Name, Total_Movement, Last_Movement_Date, Days_Since_Movement, Category, Report_Date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Report_Id,
        Item_Code,
        Deliver_Id,
        Item_Name,
        Total_Movement,
        Last_Movement_Date,
        Days_Since_Movement,
        Category,
        Report_Date,
      ]
    );

    if (!insertResponse.success) {
      throw new Error(insertResponse.error || "Failed to insert report");
    }

    return NextResponse.json(
      { message: "Report added successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to insert report", success: false }, { status: 500 });
  }
}
