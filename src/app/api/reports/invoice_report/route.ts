import { getDBConnection } from "../../../../../lib/dbAdapter"; 
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface SummaryRow extends RowDataPacket {
  TotalInvoices: number;
  TotalAmount: number;
}

export async function GET(request: NextRequest) {
  try {
    const pool = await getDBConnection();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate date range
    if ((startDate && !endDate) || (!startDate && endDate)) {
      return NextResponse.json(
        { error: "Both startDate and endDate must be provided" },
        { status: 400 }
      );
    }

    // Date filter
    const dateFilter =
      startDate && endDate ? "WHERE ci.Invoice_Date BETWEEN ? AND ?" : "";
    const params: any[] = [];
    if (startDate && endDate) params.push(startDate, endDate);

    // Customer-wise stats
    const [customerStats] = await pool.query(
      `
      SELECT 
        ci.Customer_ID,
        COUNT(ci.Invoice_ID) AS InvoiceCount,
        SUM(ci.Grand_Total) AS TotalAmount
      FROM customer_invoices ci
      ${dateFilter}
      GROUP BY ci.Customer_ID
      ORDER BY InvoiceCount DESC
      `,
      params
    );

    // Invoice details
    const [invoiceDetails] = await pool.query(
      `
      SELECT 
        ci.Invoice_ID,
        ci.Invoice_No,
        ci.Customer_ID,
        ci.Invoice_Date,
        ci.Total_Amount,
        ci.Tax_Amount,
        ci.Grand_Total,
        ii.Item_Code,
        ii.Item_Name,
        ii.Quantity,
        ii.Unit_Price,
        ii.Total_Price
      FROM customer_invoices ci
      LEFT JOIN invoice_items ii 
        ON ci.Invoice_ID = ii.Invoice_ID
      ${dateFilter}
      ORDER BY ci.Invoice_Date DESC
      `,
      params
    );

    // Overall summary
    const [summaryRows] = await pool.query(
      `
      SELECT 
        COUNT(*) AS TotalInvoices,
        SUM(Grand_Total) AS TotalAmount
      FROM customer_invoices ci
      ${dateFilter}
      `,
      params
    );

    const summary =
      summaryRows.length > 0
        ? summaryRows[0]
        : { TotalInvoices: 0, TotalAmount: 0 };

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalInvoices: summary.TotalInvoices || 0,
          totalAmount: summary.TotalAmount || 0,
          dateRange: startDate && endDate ? { startDate, endDate } : null,
        },
        customerStats,
        invoiceDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoice report:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch invoice report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

