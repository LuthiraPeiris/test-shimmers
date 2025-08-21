import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from "../../../../../lib/dbAdapter"; // Adjust path if needed

export async function POST(request: NextRequest) {
  try {
    const { search } = await request.json();

    const db = await getDBConnection();

    let query = `
      SELECT 
        po_id,
        item_name,
        supplier_name,
        quantity,
        unit_price,
        total_amount,
        status,
        created_at
      FROM purchase_orders
    `;

    const params: any[] = [];

    if (search && search.trim() !== '') {
      query += `
        WHERE 
          po_id LIKE ? OR
          item_name LIKE ? OR
          supplier_name LIKE ? OR
          status LIKE ?
      `;
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch, likeSearch);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await db.query(query, params);

    return NextResponse.json({
      success: true,
      purchaseOrders: rows || [],
    });

  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchase orders' },
      { status: 500 }
    );
  }
}
