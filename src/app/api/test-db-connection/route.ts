// import { NextResponse } from "next/server";
// import { getDBConnection } from "../../../../lib/db";

// export async function GET() {
//   try {
//     const pool = await getDBConnection();
    
//     // Test query to check if connection is working
//     const [rows]: any = await pool.execute("SELECT 1 as connection_test");
    
//     return NextResponse.json({ 
//       success: true, 
//       message: "Database connection successful",
//       testResult: rows
//     }, { status: 200 });
//   } catch (error: any) {
//     console.error("Database connection failed:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: "Database connection failed",
//       details: error.message 
//     }, { status: 500 });
//   }
// }
