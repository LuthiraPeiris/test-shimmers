import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/dbAdapter"; 
import bcrypt from "bcryptjs";

const DEFAULT_PROFILE_PIC =
  "https://www.canva.com/icons/MAEGkZHHSyM-user-profile-illustration/";

// GET all users - READ operation
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query(
      "SELECT User_ID, Name, Email, Profile_Picture, User_Address, Status FROM user_data"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST create new user - CREATE operation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Name, Email, Password, Profile_Picture, User_Address,Status } = body;

    if (!Name || !Email || !Password || !User_Address) {
      return NextResponse.json(
        { error: "Name, Email, Password, and User_Address are required" },
        { status: 400 }
      );
    }

    if (Password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Check if Email already exists
    const [existing] = await pool.query(
      "SELECT User_ID FROM user_data WHERE Email = ?",
      [Email]
    );
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Generate new User_ID
    const [lastRow] = await pool.query(
      "SELECT User_ID FROM user_data ORDER BY User_ID DESC LIMIT 1"
    );
    let newId = "U0001";
    if ((lastRow as any[]).length > 0) {
      const lastId = (lastRow as any[])[0].User_ID;
      const lastNumber = parseInt(lastId.slice(1)) || 0;
      newId = "U" + String(lastNumber + 1).padStart(4, "0");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await pool.execute(
      `INSERT INTO user_data 
        (User_ID, Name, Email, Password, Profile_Picture, User_Address, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        Name,
        Email,
        hashedPassword,
        Profile_Picture || DEFAULT_PROFILE_PIC,
        User_Address,
        'active'        // Default status
      ]
    );

    return NextResponse.json(
      {
        User_ID: newId,
        Name,
        Email,
        User_Address,
        Status: 'active'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { User_ID, Name, Email, Password, Profile_Picture, User_Address } =
      await request.json();

    if (!User_ID) {
      return NextResponse.json({ error: "User_ID is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const [existing] = await pool.query("SELECT * FROM user_data WHERE User_ID = ?", [User_ID]);

    if ((existing as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = (existing as any[])[0];
    const hashedPassword = Password ? await bcrypt.hash(Password, 10) : user.Password;

    await pool.execute(
      `UPDATE user_data 
       SET Name = ?, Email = ?, Password = ?, Profile_Picture = ?, User_Address = ?
       WHERE User_ID = ?`,
      [
        Name || user.Name,
        Email || user.Email,
        hashedPassword,
        Profile_Picture || user.Profile_Picture,
        User_Address || user.User_Address,
        User_ID,
      ]
    );

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}