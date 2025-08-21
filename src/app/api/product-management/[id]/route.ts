import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from "../../../../../lib/dbAdapter";

// ✅ GET: Fetch a single item by itemCode
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const itemCode = id;

    const pool = await getDBConnection();
    const [rows]: any = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [itemCode]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Transform to match frontend expected format
    const transformedRow = {
      itemCode: rows[0].Item_Code,
      itemName: rows[0].Item_Name,
      brand: rows[0].Brand,
      size: rows[0].Size,
      stock: rows[0].Available_Stock,
      price: rows[0].Price,
      country: rows[0].Country,
      createdDate: rows[0].Created_Date
    };

    return NextResponse.json(transformedRow, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

// ✅ PUT: Update an existing product
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Map frontend field names to database field names
    const {
      itemCode: Item_Code,
      itemName: Item_Name,
      brand: Brand,
      size: Size,
      stock: Available_Stock,
      price: Price,
      country: Country,
      createdDate: Created_Date,
    } = body;

    if (!Item_Code) {
      return NextResponse.json(
        { error: "Item_Code is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Check existence
    const [existing]: any = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [Item_Code]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Update product
    await pool.execute(
      `UPDATE item_master_data 
       SET Item_Name = ?, Brand = ?, Size = ?, Available_Stock = ?, Price = ?, Country = ?, Created_Date = ?
       WHERE Item_Code = ?`,
      [
        Item_Name ?? existing[0].Item_Name,
        Brand ?? existing[0].Brand,
        Size ?? existing[0].Size,
        Available_Stock ?? existing[0].Available_Stock,
        Price ?? existing[0].Price,
        Country ?? existing[0].Country,
        Created_Date ?? existing[0].Created_Date,
        Item_Code,
      ]
    );

    const [updated]: any = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [Item_Code]
    );

    // Transform to match frontend expected format
    const transformedRow = {
      itemCode: updated[0].Item_Code,
      itemName: updated[0].Item_Name,
      brand: updated[0].Brand,
      size: updated[0].Size,
      stock: updated[0].Available_Stock,
      price: updated[0].Price,
      country: updated[0].Country,
      createdDate: updated[0].Created_Date
    };

    return NextResponse.json(transformedRow, { status: 200 });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove an item by itemCode
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const itemCode = id.trim();
    console.log("Deleting product with itemCode:", itemCode);

    const pool = await getDBConnection();

    const [existing]: any = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [itemCode]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await pool.execute(
      "DELETE FROM item_master_data WHERE Item_Code = ?",
      [itemCode]
    );

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}
