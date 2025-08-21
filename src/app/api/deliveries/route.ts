import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../lib/dbAdapter';
import { DeliveryService } from '../services/deliveryService';

interface DeliveryRecord {
  Deliver_Id?: string;
  Sales_Order_ID?: string;
  Item_Code: string;
  Item_Name: string;
  Quantity: number;
  Date: string;
  Status: string;
}

// ===== GET: Fetch deliveries with optional search and pagination =====
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const pool = await getDBConnection();

    let query = `
      SELECT 
        dd.*, 
        im.Item_Name AS Master_Item_Name,
        im.Available_Stock
      FROM deliver_data dd
      LEFT JOIN item_master_data im ON dd.Item_Code = im.Item_Code
    `;
    const params: any[] = [];

    if (search) {
      const pattern = `%${search}%`;
      query += `
        WHERE dd.Deliver_Id LIKE ? 
          OR dd.Item_Code LIKE ? 
          OR dd.Item_Name LIKE ? 
          OR dd.Status LIKE ?
      `;
      params.push(pattern, pattern, pattern, pattern);
    }

    query += ` ORDER BY dd.Date DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [deliveries] = await pool.query(query, params);

    // Total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM deliver_data dd';
    const countParams: any[] = [];
    if (search) countParams.push(...params.slice(0, 4)), countQuery += `
      WHERE dd.Deliver_Id LIKE ? 
        OR dd.Item_Code LIKE ? 
        OR dd.Item_Name LIKE ? 
        OR dd.Status LIKE ?`;
    const [countRows]: any = await pool.query(countQuery, countParams);
    const total = countRows[0]?.total || 0;

    return NextResponse.json({ success: true, deliveries, page, limit, total });
  } catch (error) {
    console.error('GET deliveries error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch deliveries' }, { status: 500 });
  }
}

// ===== POST: Create a new delivery with stock trigger =====
export async function POST(req: NextRequest) {
  try {
    const body: DeliveryRecord = await req.json();
    const deliveryService = new DeliveryService();

    const result = await deliveryService.createDelivery({
      item_code: body.Item_Code,
      item_name: body.Item_Name,
      quantity: body.Quantity,
      date: body.Date,
      status: body.Status,
      Sales_Order_ID: body.Sales_Order_ID || undefined
    });

    return NextResponse.json({
      success: true,
      message: 'Delivery created with stock update',
      Deliver_Id: result.deliverId
    }, { status: 201 });
  } catch (error) {
    console.error('POST delivery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create delivery' }, { status: 500 });
  }
}

// ===== PUT: Update a delivery =====
export async function PUT(req: NextRequest) {
  try {
    const body: DeliveryRecord & { Deliver_Id: string } = await req.json();
    if (!body.Deliver_Id) {
      return NextResponse.json({ success: false, error: 'Deliver_Id is required' }, { status: 400 });
    }

    const pool = await getDBConnection();
    await pool.query(
      `UPDATE deliver_data SET 
        Sales_Order_ID = ?, 
        Item_Code = ?, 
        Item_Name = ?, 
        Quantity = ?, 
        Date = ?, 
        Status = ?
       WHERE Deliver_Id = ?`,
      [
        body.Sales_Order_ID || null,
        body.Item_Code,
        body.Item_Name,
        body.Quantity,
        body.Date,
        body.Status,
        body.Deliver_Id
      ]
    );

    return NextResponse.json({ success: true, message: 'Delivery updated successfully' });
  } catch (error) {
    console.error('PUT delivery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update delivery' }, { status: 500 });
  }
}

// ===== DELETE: Delete a delivery =====
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const Deliver_Id = url.searchParams.get('Deliver_Id');

    if (!Deliver_Id) {
      return NextResponse.json({ success: false, error: 'Deliver_Id is required' }, { status: 400 });
    }

    const pool = await getDBConnection();
    await pool.query('DELETE FROM deliver_data WHERE Deliver_Id = ?', [Deliver_Id]);

    return NextResponse.json({ success: true, message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('DELETE delivery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete delivery' }, { status: 500 });
  }
}
