import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter"; 

// GET all settings (or by User_ID)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  try {
    const pool = await getDBConnection();
    const [rows] = userId
      ? await pool.query("SELECT * FROM user_settings WHERE User_ID = ?", [
          userId,
        ])
      : await pool.query(
          "SELECT * FROM user_settings ORDER BY created_at DESC"
        );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings", details: error },
      { status: 500 }
    );
  }
}

// POST - Create a new setting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { User_ID, name, value, type, description, isEnabled } = body;

    if (!User_ID || !name) {
      return NextResponse.json(
        { error: "User_ID and name are required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();
    await pool.query(
      `INSERT INTO user_settings (User_ID, name, value, type, description, isEnabled)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [User_ID, name, value, type, description, isEnabled ?? true]
    );

    return NextResponse.json({ message: "Setting created successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create setting", details: error },
      { status: 500 }
    );
  }
}

// PUT - Update setting by Setting_ID
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { Setting_ID, name, value, type, description, isEnabled } = body;

    if (!Setting_ID) {
      return NextResponse.json(
        { error: "Setting_ID is required" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "Failed to update setting", details: error },
      { status: 500 }
    );
  }
}

// DELETE - by Setting_ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing Setting_ID in query params" },
      { status: 400 }
    );
  }

  try {
    const pool = await getDBConnection();
    await pool.query("DELETE FROM user_settings WHERE Setting_ID = ?", [id]);
    return NextResponse.json({ message: "Setting deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete setting", details: error },
      { status: 500 }
    );
  }
}

// I have gathered the following information:

// Information Gathered:
// - The UserSettingsPage fetches user data from the API endpoint `/api/UserSettings` and updates it via PUT to the same endpoint.
// - The API at `src/app/api/UserSettings/route.ts` supports GET (fetch all users), POST (create user), and PUT (update user) operations.
// - The API at `src/app/api/UserSettings/[id]/route.ts` supports GET (fetch single user), PUT (update user), and DELETE (delete user) operations by user ID.
// - The UserSettingsForm component manages settings with fields: name, value, type, description, isEnabled.
// - The UserSettingsTable component displays user data with fields: User_ID, Name, Email, Profile_Picture, User_Address, Status, and supports edit/delete actions.

// Plan:
// - Since the UserSettingsPage currently fetches and updates user data from `/api/UserSettings` without user ID, and the API supports user CRUD operations both at collection and individual user level, the API is mostly complete.
// - However, the UserSettingsForm component's data structure (name, value, type, description, isEnabled) does not match the user_data table fields (User_ID, Name, Email, Password, Profile_Picture, User_Address, Status).
// - We need to clarify if the UserSettingsPage is for managing user profile data or user settings as key-value pairs.
// - If the goal is to have a complete API for user settings (key-value pairs), then a new API for user settings should be created.
// - If the goal is to have a complete API for user profile management, the existing API is mostly complete.
// - I will check if there is an existing API for user settings key-value pairs or if it needs to be created.

// Next step:
// - Search for any existing API related to user settings key-value pairs or settings management.

// <search_code>
// <query>UserSettings key value</query>
// <path>src/app/api/UserSettings</path>
// </search_code>
