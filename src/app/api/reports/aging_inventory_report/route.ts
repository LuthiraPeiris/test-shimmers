import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter"; 
// GET Aging Report
export async function GET() {
  try {
    const pool = await getDBConnection();

    const [rows] = await pool.query(`
      SELECT 
        imd.Item_Code,
        imd.Item_Name,
        imd.Brand,
        imd.Size,
        imd.Country,
        imd.Price,
        COALESCE(imd.Available_Stock, 0) as Available_Stock,
        grd.Mf_Date,
        grd.Ex_Date,
        grd.Quantity,
        grd.Unit_Price,
        grd.Total_Amount,
        grd.Status,
        imd.Created_Date
      FROM 
        good_receipts_data AS grd
      INNER JOIN 
        item_master_data AS imd 
      ON 
        imd.Item_Code = grd.Item_Code
      WHERE 
        grd.Status IN ('RECEIVED', 'Received')
      ORDER BY 
        grd.Ex_Date ASC;
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating aging report:", error);
    return NextResponse.json(
      { error: "Failed to generate aging report" },
      { status: 500 }
    );
  }
}
