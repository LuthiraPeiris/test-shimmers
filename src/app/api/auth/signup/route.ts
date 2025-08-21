import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDBConnection } from "../../../../../lib/dbAdapter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { Name, Email, Password, Profile_Picture, User_Address } = body;

    // Validate required fields
    if (!Name || !Email || !Password || !User_Address) {
      return NextResponse.json(
        { error: 'Name, Email, Password, and User_Address are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (Password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Check if email already exists
    const [existing] = await pool.query(
      'SELECT User_ID FROM user_data WHERE Email = ?',
      [Email]
    );
    
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Generate new User_ID
    const [lastRow] = await pool.query(
      'SELECT User_ID FROM user_data ORDER BY User_ID DESC LIMIT 1'
    );
    
    let newId = 'U0001';
    if ((lastRow as any[]).length > 0) {
      const lastId = (lastRow as any[])[0].User_ID;
      const lastNumber = parseInt(lastId.slice(1)) || 0;
      newId = 'U' + String(lastNumber + 1).padStart(4, '0');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Insert new user
    await pool.execute(
      `INSERT INTO user_data 
        (User_ID, Name, Email, Password, Profile_Picture, User_Address, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        Name,
        Email,
        hashedPassword,
        Profile_Picture || 'https://www.canva.com/icons/MAEGkZHHSyM-user-profile-illustration/',
        User_Address,
        'active'
      ]
    );

    // Fetch the created user without password
    const [newUser] = await pool.query(
      'SELECT User_ID, Name, Email, Profile_Picture, User_Address, Status FROM user_data WHERE User_ID = ?',
      [newId]
    );

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: (newUser as any[])[0]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
