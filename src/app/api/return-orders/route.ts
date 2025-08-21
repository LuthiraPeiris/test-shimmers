import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/dbAdapter";

// ✅ GET - Fetch all return orders
export async function GET() {
  let pool;
  try {
    pool = await getDBConnection();

    const [rows]: any = await pool.execute(
      `SELECT 
        Return_Order_ID,
        Original_Order_ID,
        Customer_ID,
        Return_Date,
        Return_Reason_Code,
        Return_Status,
        Refund_Amount,
        Created_At,
        Updated_At
      FROM return_orders
      ORDER BY Created_At DESC`
    );

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching return orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch return orders" },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.end();
  }
}

// ✅ POST - Create a new return order
export async function POST(request: NextRequest) {
  let pool;
  try {
    const body = await request.json();

    const requiredFields = [
      "Original_Order_ID",
      "Customer_ID",
      "Return_Date",
      "Return_Reason_Code",
      "Return_Status",
      "Refund_Amount",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    pool = await getDBConnection();

    const [result]: any = await pool.execute(
      `INSERT INTO return_orders (
        Original_Order_ID,
        Customer_ID,
        Return_Date,
        Return_Reason_Code,
        Return_Status,
        Refund_Amount,
        Created_At,
        Updated_At
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        body.Original_Order_ID,
        body.Customer_ID,
        body.Return_Date,
        body.Return_Reason_Code,
        body.Return_Status,
        body.Refund_Amount,
      ]
    );

    const insertId = result.insertId;

    const [newReturnOrder]: any = await pool.execute(
      `SELECT * FROM return_orders WHERE Return_Order_ID = ?`,
      [insertId]
    );

    return NextResponse.json(
      {
        success: true,
        data: newReturnOrder[0],
        message: "Return order created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating return order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create return order" },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.end();
  }
}

// ✅ PUT - Update return order
export async function PUT(request: NextRequest) {
  let pool;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Return order ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    pool = await getDBConnection();

    const [existing]: any = await pool.execute(
      `SELECT * FROM return_orders WHERE Return_Order_ID = ?`,
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Return order not found" },
        { status: 404 }
      );
    }

    const fields: string[] = [];
    const values: any[] = [];

    const updatableFields = [
      "Original_Order_ID",
      "Customer_ID",
      "Return_Date",
      "Return_Reason_Code",
      "Return_Status",
      "Refund_Amount",
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    fields.push("Updated_At = NOW()");
    values.push(id);

    const [result]: any = await pool.execute(
      `UPDATE return_orders SET ${fields.join(", ")} WHERE Return_Order_ID = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update return order" },
        { status: 500 }
      );
    }

    const [updatedReturnOrder]: any = await pool.execute(
      `SELECT * FROM return_orders WHERE Return_Order_ID = ?`,
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        data: updatedReturnOrder[0],
        message: "Return order updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating return order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update return order" },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.end();
  }
}

// ✅ DELETE - Remove a return order
export async function DELETE(request: NextRequest) {
  let pool;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Return order ID is required" },
        { status: 400 }
      );
    }

    pool = await getDBConnection();

    const [existing]: any = await pool.execute(
      `SELECT * FROM return_orders WHERE Return_Order_ID = ?`,
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Return order not found" },
        { status: 404 }
      );
    }

    const [result]: any = await pool.execute(
      `DELETE FROM return_orders WHERE Return_Order_ID = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to delete return order" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Return order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting return order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete return order" },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.end();
  }
}
