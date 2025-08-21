import { getDBConnection } from "../../../../../lib/dbAdapter"; 
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface InvoiceRow extends RowDataPacket {
  Invoice_ID: number;
  Invoice_No: string;
  Customer_ID: string;
  User_ID: string;
  Invoice_Date: string;
  Payment_Terms: string;
  Total_Amount: number;
  Tax_Amount: number;
  Grand_Total: number;
  status: string;
  Notes: string;
}

interface SummaryRow extends RowDataPacket {
  status: string;
  count: number;
}

export async function GET(request: NextRequest) {
  try {
    const pool = await getDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (startDate && endDate) {
      conditions.push("Invoice_Date BETWEEN ? AND ?");
      params.push(startDate, endDate);
    }

    if (status && status !== "all") {
      conditions.push("status = ?");
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Main invoice query
    const query = `
      SELECT 
        Invoice_ID,
        Invoice_No,
        Customer_ID,
        User_ID,
        Invoice_Date,
        Payment_Terms,
        Total_Amount,
        Tax_Amount,
        Grand_Total,
        status,
        Notes
      FROM customer_invoices
      ${whereClause}
      ORDER BY Invoice_Date DESC
    `;

    const [results] = await pool.execute(query, params) as [InvoiceRow[], any];

    // Count by status query
    const countQuery = `
      SELECT 
        status,
        COUNT(*) as count
      FROM customer_invoices
      ${whereClause}
      GROUP BY status
    `;
    const [countRows] = await pool.execute(countQuery, params) as [SummaryRow[], any];

    // Ensure we have counts for all statuses
    const statusCounts = {
      PENDING: 0,
      PAID: 0,
      OVERDUE: 0
    };

    countRows.forEach(row => {
      if (row.status in statusCounts) {
        statusCounts[row.status as keyof typeof statusCounts] = row.count;
      }
    });

    const invoiceCounts = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      InvoiceCount: count
    }));

    return NextResponse.json(
      {
        success: true,
        data: results,
        counts: invoiceCounts
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoice counter report:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch invoice counter report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
