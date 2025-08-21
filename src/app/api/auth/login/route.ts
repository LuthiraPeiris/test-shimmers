import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDBConnection } from "../../../../../lib/dbAdapter";

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();
    
    // Find user by User ID
    const [rows] = await pool.query(
      'SELECT User_ID, Name, Email, Password, Profile_Picture, User_Address, Status FROM user_data WHERE User_ID = ?',
      [userId]
    );

    const users = rows as any[];
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid User ID or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    
    // Check if user is active
    if (user.Status && user.Status.toLowerCase() !== 'active' && user.Status !== '') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 403 }
      );
    }
    
    // Verify password (plain text comparison)
    if (password !== user.Password) {
      return NextResponse.json(
        { error: 'Invalid User ID or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.User_ID,
        email: user.Email,
        name: user.Name 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { Password: _, ...userData } = user;

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
