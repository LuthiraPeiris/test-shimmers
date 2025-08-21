import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/dbAdapter';

export async function GET() {
  try {
    const db = await getDBConnection();
    const [rows] = await db.execute(
      `SELECT Sales_Order_ID FROM sales_orders ORDER BY Sales_Order_ID DESC LIMIT 1`
    );

    let nextId = "SO0001";
    if ((rows as any[]).length > 0) {
      const lastId = (rows as any[])[0].Sales_Order_ID;
      const numeric = parseInt(lastId.replace("SO", ""), 10);
      nextId = "SO" + String(numeric + 1).padStart(4, "0");
    }

    return NextResponse.json({ nextId });
  } catch (error) {
    console.error('Error fetching next order ID:', error);
    return NextResponse.json({ error: 'Failed to fetch next order ID' }, { status: 500 });
  }
}
