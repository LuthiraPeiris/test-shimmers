import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from "../../../../../lib/dbAdapter"; 
import bcrypt from "bcryptjs";

// GET single user by ID - READ operation
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const [rows] = await pool.query(
      "SELECT User_ID, Name, Email, Profile_Picture, User_Address, Status FROM user_data WHERE User_ID = ?",
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json((rows as any[])[0]);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PUT update user by ID - UPDATE operation
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { Name, Email, Password, Profile_Picture, User_Address, Status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const [existing] = await pool.query("SELECT * FROM user_data WHERE User_ID = ?", [id]);

    if ((existing as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = (existing as any[])[0];
    let hashedPassword = user.Password;
    
    if (Password && Password !== user.Password) {
      if (Password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      hashedPassword = await bcrypt.hash(Password, 10);
    }

    // Check if new email already exists (excluding current user)
    if (Email && Email !== user.Email) {
      const [existingEmail] = await pool.query(
        "SELECT * FROM user_data WHERE Email = ? AND User_ID != ?",
        [Email, id]
      );
      if ((existingEmail as any[]).length > 0) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    await pool.execute(
      `UPDATE user_data 
       SET Name = ?, Email = ?, Password = ?, Profile_Picture = ?, User_Address = ?, Status = ?
       WHERE User_ID = ?`,
      [
        Name || user.Name,
        Email || user.Email,
        hashedPassword,
        Profile_Picture || user.Profile_Picture,
        User_Address || user.User_Address,
        Status || user.Status,
        id,
      ]
    );

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE user by ID - DELETE operation
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const [result] = await pool.execute("DELETE FROM user_data WHERE User_ID = ?", [id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}