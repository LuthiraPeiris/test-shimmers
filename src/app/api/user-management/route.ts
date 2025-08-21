import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../lib/lambdaClient";

// ✅ GET: Fetch all users for dropdown
export async function GET(request: Request) {
  try {
    const query = `
      SELECT User_ID, Name, Email, Profile_Picture, User_Address, Status 
      FROM user_data 
      ORDER BY Name ASC
    `;

    const response = await lambdaClient.select(query, []);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch users");
    }

    return NextResponse.json(
      { success: true, users: response.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ✅ POST: Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { User_ID, Name, Email, Password, Profile_Picture, User_Address, Status } = body;

    if (!User_ID || !Name || !Email || !Password) {
      return NextResponse.json(
        { success: false, error: "User_ID, Name, Email, and Password are required" },
        { status: 400 }
      );
    }

    const insertResponse = await lambdaClient.insert(
      `INSERT INTO user_data (User_ID, Name, Email, Password, Profile_Picture, User_Address, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [User_ID, Name, Email, Password, Profile_Picture || null, User_Address || null, Status || "Active"]
    );

    if (!insertResponse.success) {
      throw new Error(insertResponse.error || "Failed to create user");
    }

    return NextResponse.json(
      { success: true, message: "User created successfully", User_ID, Name, Email },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
