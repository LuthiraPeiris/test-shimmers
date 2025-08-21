// app/api/UserSettings/keyValue/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter"; 

// GET all settings (or by User_ID)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  try {
    const pool = await getDBConnection();
    const [rows] = userId
      ? await pool.query("SELECT * FROM user_settings WHERE User_ID = ?", [userId])
      : await pool.query("SELECT * FROM user_settings ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings", details: error }, { status: 500 });
  }
}

// POST - Create a new setting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { User_ID, name, value, type, description, isEnabled } = body;

    if (!User_ID || !name) {
      return NextResponse.json({ error: "User_ID and name are required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    await pool.query(
      `INSERT INTO user_settings (User_ID, name, value, type, description, isEnabled)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [User_ID, name, value, type, description, isEnabled ?? true]
    );

    return NextResponse.json({ message: "Setting created successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create setting", details: error }, { status: 500 });
  }
}

// PUT - Update setting by Setting_ID
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { Setting_ID, name, value, type, description, isEnabled } = body;

    if (!Setting_ID) {
      return NextResponse.json({ error: "Setting_ID is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    await pool.query(
      `UPDATE user_settings
       SET name = ?, value = ?, type = ?, description = ?, isEnabled = ?
       WHERE Setting_ID = ?`,
      [name, value, type, description, isEnabled, Setting_ID]
    );

    return NextResponse.json({ message: "Setting updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update setting", details: error }, { status: 500 });
  }
}

// DELETE - by Setting_ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing Setting_ID in query params" }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    await pool.query("DELETE FROM user_settings WHERE Setting_ID = ?", [id]);
    return NextResponse.json({ message: "Setting deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete setting", details: error }, { status: 500 });
  }
}
