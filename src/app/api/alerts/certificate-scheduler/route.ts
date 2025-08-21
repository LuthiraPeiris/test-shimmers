import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter";

// GET - Check certificates expiring in 6 months and generate alerts
export async function GET() {
  try {
    const pool = await getDBConnection();
    
    // Calculate date 6 months from now
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    // Find certificates expiring within 6 months that don't have alerts yet
    const query = `
      SELECT cr.* 
      FROM certification_report cr
      LEFT JOIN certification_expiry_notification cen 
        ON cr.Reg_Id = cen.Reg_Id 
        AND cen.Notification_Status = 'active'
        AND cen.Expiry_Date = cr.Expiry_Date
      WHERE cr.Expiry_Date <= ? 
        AND cr.Expiry_Date >= CURDATE()
        AND cen.Notification_ID IS NULL
      ORDER BY cr.Expiry_Date ASC
    `;
    
    const [certificates] = await pool.execute(query, [sixMonthsFromNow.toISOString().split('T')[0]]);
    
    const generatedAlerts = [];
    
    // Generate alerts for each certificate
    for (const cert of certificates as any[]) {
      // Get next notification ID
      const [lastId] = await pool.execute(
        "SELECT Notification_ID FROM certification_expiry_notification ORDER BY Notification_ID DESC LIMIT 1"
      ) as any[];
      
      let newNotificationId = "N0001";
      if (lastId.length > 0) {
        const lastNum = parseInt(lastId[0].Notification_ID.replace("N", ""));
        newNotificationId = `N${(lastNum + 1).toString().padStart(4, "0")}`;
      }
      
      // Insert new alert
      await pool.execute(
        `INSERT INTO certification_expiry_notification 
         (Notification_ID, Reg_Id, Certification_Name, Expiry_Date, Notification_Status, Alert_Date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newNotificationId,
          cert.Reg_Id,
          cert.Certificate_Name,
          cert.Expiry_Date,
          'active',
          new Date().toISOString().split('T')[0]
        ]
      );
      
      generatedAlerts.push({
        notificationId: newNotificationId,
        regId: cert.Reg_Id,
        certificateName: cert.Certificate_Name,
        expiryDate: cert.Expiry_Date,
        alertDate: new Date().toISOString().split('T')[0]
      });
    }
    
    return NextResponse.json({
      message: `Generated ${generatedAlerts.length} new alerts`,
      alerts: generatedAlerts,
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error("Certificate scheduler error:", error);
    return NextResponse.json(
      { error: "Failed to process certificate alerts" },
      { status: 500 }
    );
  }
}

// POST - Manual trigger for specific certificates
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { monthsAdvance = 6, regIds = [] } = body;
    
    const pool = await getDBConnection();
    
    // Calculate advance date
    const advanceDate = new Date();
    advanceDate.setMonth(advanceDate.getMonth() + monthsAdvance);
    
    let query = `
      SELECT cr.* 
      FROM certification_report cr
      LEFT JOIN certification_expiry_notification cen 
        ON cr.Reg_Id = cen.Reg_Id 
        AND cen.Notification_Status = 'active'
        AND cen.Expiry_Date = cr.Expiry_Date
      WHERE cr.Expiry_Date <= ? 
        AND cr.Expiry_Date >= CURDATE()
        AND cen.Notification_ID IS NULL
    `;
    
    const params = [advanceDate.toISOString().split('T')[0]];
    
    if (regIds.length > 0) {
      query += ` AND cr.Reg_Id IN (${regIds.map(() => '?').join(',')})`;
      params.push(...regIds);
    }
    
    const [certificates] = await pool.execute(query, params);
    
    const generatedAlerts = [];
    
    for (const cert of certificates as any[]) {
      const [lastId] = await pool.execute(
        "SELECT Notification_ID FROM certification_expiry_notification ORDER BY Notification_ID DESC LIMIT 1"
      ) as any[];
      
      let newNotificationId = "N0001";
      if (lastId.length > 0) {
        const lastNum = parseInt(lastId[0].Notification_ID.replace("N", ""));
        newNotificationId = `N${(lastNum + 1).toString().padStart(4, "0")}`;
      }
      
      await pool.execute(
        `INSERT INTO certification_expiry_notification 
         (Notification_ID, Reg_Id, Certification_Name, Expiry_Date, Notification_Status, Alert_Date, Advance_Months)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newNotificationId,
          cert.Reg_Id,
          cert.Certificate_Name,
          cert.Expiry_Date,
          'active',
          new Date().toISOString().split('T')[0],
          monthsAdvance
        ]
      );
      
      generatedAlerts.push({
        notificationId: newNotificationId,
        regId: cert.Reg_Id,
        certificateName: cert.Certificate_Name,
        expiryDate: cert.Expiry_Date,
        alertDate: new Date().toISOString().split('T')[0],
        advanceMonths: monthsAdvance
      });
    }
    
    return NextResponse.json({
      message: `Generated ${generatedAlerts.length} alerts for ${monthsAdvance} months advance`,
      alerts: generatedAlerts,
      timestamp: new Date().toISOString()
    }, { status: 201 });
    
  } catch (error) {
    console.error("Manual alert generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate manual alerts" },
      { status: 500 }
    );
  }
}
