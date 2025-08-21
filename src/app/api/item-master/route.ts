import { NextResponse } from 'next/server';
import { getDBConnection } from "../../../../lib/dbAdapter";

export async function GET() {
  let pool;
  try {
    pool = await getDBConnection();
    const [rows] = await pool.query(
      'SELECT Item_Code, Item_Name FROM item_master_data ORDER BY Item_Code ASC'
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching item master data:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  } finally {
    if (pool) await pool.end();
  }
}
