import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter"; 
import bcrypt from "bcryptjs";

// GET all user settings with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    const pool = await getDBConnection();
    
    let query = `
      SELECT User_ID, Name, Email, Profile_Picture, User_Address, Status, Created_At, Updated_At 
      FROM user_data 
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (search) {
      query += ` AND (Name LIKE ? OR Email LIKE ? OR User_Address LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status) {
      query += ` AND Status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY Created_At DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM user_data WHERE 1=1`;
    const countParams: any[] = [];
    
    if (search) {
      countQuery += ` AND (Name LIKE ? OR Email LIKE ? OR User_Address LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status) {
      countQuery += ` AND Status = ?`;
      countParams.push(status);
    }
    
    const [countResult] = await pool.query(countQuery, countParams);
    const total = (countResult as any)[0].total;

    return NextResponse.json({
      users: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST create new user settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      Name, 
      Email, 
      Password, 
      Profile_Picture, 
      User_Address, 
      Status = 'active',
      Phone,
      Date_of_Birth,
      Gender,
      Language = 'en',
      Timezone = 'UTC',
      Currency = 'USD'
    } = body;

    // Validation
    const errors: string[] = [];
    
    if (!Name?.trim()) errors.push("Name is required");
    if (!Email?.trim()) errors.push("Email is required");
    if (!Password?.trim()) errors.push("Password is required");
    if (!User_Address?.trim()) errors.push("Address is required");
    
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
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
    const defaultProfilePic = "https://www.canva.com/icons/MAEGkZHHSyM-user-profile-illustration/";

    await pool.execute(
      `INSERT INTO user_data 
       (User_ID, Name, Email, Password, Profile_Picture, User_Address, Status, 
        Phone, Date_of_Birth, Gender, Language, Timezone, Currency, Created_At, Updated_At)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        newId,
        Name.trim(),
        Email.toLowerCase().trim(),
        hashedPassword,
        Profile_Picture || defaultProfilePic,
        User_Address.trim(),
        Status,
        Phone || null,
        Date_of_Birth || null,
        Gender || null,
        Language,
        Timezone,
        Currency
      ]
    );

    // Fetch the created user
    const [newUser] = await pool.query(
      "SELECT User_ID, Name, Email, Profile_Picture, User_Address, Status, Phone, Date_of_Birth, Gender, Language, Timezone, Currency, Created_At FROM user_data WHERE User_ID = ?",
      [newId]
    );

    return NextResponse.json(
      { user: (newUser as any[])[0], message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT update user settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { User_ID, updates } = body;

    if (!User_ID || !updates) {
      return NextResponse.json({ error: "User_ID and updates are required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const [existing] = await pool.query(
      "SELECT * FROM user_data WHERE User_ID = ?",
      [User_ID]
    );

    if ((existing as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = (existing as any[])[0];
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'User_ID') {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    values.push(User_ID);

    const query = `UPDATE user_data SET ${fields.join(", ")}, Updated_At = NOW() WHERE User_ID = ?`;
    await pool.execute(query, values);

    // Fetch updated user
    const [updatedUser] = await pool.query(
      "SELECT User_ID, Name, Email, Profile_Picture, User_Address, Status, Phone, Date_of_Birth, Gender, Language, Timezone, Currency, Updated_At FROM user_data WHERE User_ID = ?",
      [User_ID]
    );

    return NextResponse.json(
      { user: (updatedUser as any[])[0], message: "User updated successfully" }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE bulk delete user settings
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userIds } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "userIds array is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const placeholders = userIds.map(() => '?').join(',');
    
    const [result] = await pool.execute(
      `DELETE FROM user_data WHERE User_ID IN (${placeholders})`,
      userIds
    );

    const affectedRows = (result as any).affectedRows;

    return NextResponse.json({
      message: `${affectedRows} user(s) deleted successfully`,
      deletedCount: affectedRows
    });
  } catch (error) {
    console.error("Delete users error:", error);
    return NextResponse.json({ error: "Failed to delete users" }, { status: 500 });
  }
}
