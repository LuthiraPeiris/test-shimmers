import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter"; 

// GET certificates within a date range and show expiry duration
export async function GET(req: Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing startDate or endDate in query parameters" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `
      SELECT 
        Reg_Id,
        Certificate_Name,
        Item_Code,
        Item_Name,
        Expiry_Date,
        CONCAT(
          TIMESTAMPDIFF(YEAR, CURRENT_DATE, Expiry_Date), ' years, ',
          TIMESTAMPDIFF(MONTH, CURRENT_DATE, Expiry_Date) % 12, ' months, ',
          DATEDIFF(
            Expiry_Date,
            DATE_ADD(
              DATE_ADD(CURRENT_DATE, INTERVAL TIMESTAMPDIFF(YEAR, CURRENT_DATE, Expiry_Date) YEAR),
              INTERVAL TIMESTAMPDIFF(MONTH, CURRENT_DATE, Expiry_Date) % 12 MONTH
            )
          ), ' days'
        ) AS Expiry_Duration
      FROM 
        certification_report
      WHERE 
        Expiry_Date BETWEEN ? AND ?
      ORDER BY 
        Expiry_Date ASC
      `,
      [startDate, endDate]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
