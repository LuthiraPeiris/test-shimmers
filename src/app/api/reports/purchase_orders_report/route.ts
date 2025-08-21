import { NextResponse } from 'next/server';
import { getDBConnection } from "../../../../../lib/dbAdapter"; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const statusFilter = searchParams.get('status');
    const searchTerm = searchParams.get('search');

    const pool = await getDBConnection();

    let query = `
      SELECT 
        Po_Id AS po_id,
        Created_Date AS created_date,
        Location AS location,
        Supplier_Id AS supplier_id,
        Supplier_Name AS supplier_name,
        Item_Code AS item_code,
        Item_Name AS item_name,
        Price AS price,
        Quantity AS quantity,
        DisValue AS dis_value,
        TotValue AS tot_value,
        Status AS status
      FROM purchase_order
      WHERE 1=1
    `;

    const params: (string | number)[] = [];

    if (startDate && endDate) {
      query += ` AND Created_Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    if (statusFilter && statusFilter.toLowerCase() !== 'all') {
      query += ` AND LOWER(Status) = LOWER(?)`;
      params.push(statusFilter);
    }

    if (searchTerm) {
      query += ` AND (
        Po_Id LIKE ? OR
        Supplier_Name LIKE ? OR
        Item_Name LIKE ? OR
        Status LIKE ?
      )`;
      const searchParam = `%${searchTerm}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    query += ` ORDER BY Created_Date DESC`;

    const [rows] = await pool.execute(query, params);
    
    return NextResponse.json({
      success: true,
      data: Array.isArray(rows) ? rows : [],
      count: Array.isArray(rows) ? rows.length : 0
    });

  } catch (error) {
    console.error('Error fetching purchase orders report:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch purchase orders report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
