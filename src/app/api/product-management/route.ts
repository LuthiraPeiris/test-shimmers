import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/dbAdapter";

// ✅ GET all products
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows]: any = await pool.query("SELECT * FROM item_master_data");

    // Transform rows into frontend-friendly format
    const transformed = rows.map((row: any) => ({
      itemCode: row.Item_Code,
      itemName: row.Item_Name,
      brand: row.Brand,
      size: row.Size,
      stock: row.Available_Stock,
      price: row.Price,
      country: row.Country,
      createdDate: row.Created_Date,
    }));

    return NextResponse.json(transformed, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      itemCode,
      itemName,
      brand,
      size,
      stock,
      price,
      country,
      createdDate,
    } = body;

    if (!itemCode || !itemName) {
      return NextResponse.json(
        { error: "itemCode and itemName are required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Check if product already exists
    const [existing]: any = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [itemCode]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Product with this code already exists" },
        { status: 409 }
      );
    }

    // Insert product
    await pool.execute(
      `INSERT INTO item_master_data 
       (Item_Code, Item_Name, Brand, Size, Available_Stock, Price, Country, Created_Date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [itemCode, itemName, brand, size, stock, price, country, createdDate]
    );

    return NextResponse.json(body, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT update product (requires itemCode)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      itemCode,
      itemName,
      brand,
      size,
      stock,
      price,
      country,
      createdDate,
    } = body;

    if (!itemCode) {
      return NextResponse.json(
        { error: "itemCode is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    const [existing]: any = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [itemCode]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await pool.execute(
      `UPDATE item_master_data SET
       Item_Name = ?, Brand = ?, Size = ?, Available_Stock = ?, Price = ?, Country = ?, Created_Date = ?
       WHERE Item_Code = ?`,
      [
        itemName ?? existing[0].Item_Name,
        brand ?? existing[0].Brand,
        size ?? existing[0].Size,
        stock ?? existing[0].Available_Stock,
        price ?? existing[0].Price,
        country ?? existing[0].Country,
        createdDate ?? existing[0].Created_Date,
        itemCode,
      ]
    );

    return NextResponse.json({ message: "Product updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE product (by query param ?itemCode=)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemCode = searchParams.get("itemCode");

    if (!itemCode) {
      return NextResponse.json(
        { error: "itemCode is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();
    const [existing]: any = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [itemCode]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await pool.execute("DELETE FROM item_master_data WHERE Item_Code = ?", [
      itemCode,
    ]);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}
