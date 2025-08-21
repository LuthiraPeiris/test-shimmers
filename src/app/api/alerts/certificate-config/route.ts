import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter";

// GET - Get certificate alert configuration
export async function GET() {
  try {
    const pool = await getDBConnection();
    
    // Get current configuration
    const [config] = await pool.execute(
      "SELECT * FROM certificate_alert_config WHERE id = 1"
    );
    
    if ((config as any[]).length === 0) {
      // Return default configuration if not exists
      const defaultConfig = {
        advanceMonths: 6,
        enabled: true,
        emailNotifications: true,
        smsNotifications: false,
        notificationFrequency: 'daily',
        lastRun: null,
        nextRun: null
      };
      
      return NextResponse.json(defaultConfig, { status: 200 });
    }
    
    return NextResponse.json((config as any[])[0], { status: 200 });
  } catch (error) {
    console.error("GET config error:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate alert configuration" },
      { status: 500 }
    );
  }
}

// PUT - Update certificate alert configuration
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();
    
    const {
      advanceMonths = 6,
      enabled = true,
      emailNotifications = true,
      smsNotifications = false,
      notificationFrequency = 'daily'
    } = body;
    
    // Update or insert configuration
    await pool.execute(
      `INSERT INTO certificate_alert_config (id, advance_months, enabled, email_notifications, sms_notifications, notification_frequency, updated_at)
       VALUES (1, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
       advance_months = VALUES(advance_months),
       enabled = VALUES(enabled),
       email_notifications = VALUES(email_notifications),
       sms_notifications = VALUES(sms_notifications),
       notification_frequency = VALUES(notification_frequency),
       updated_at = NOW()`,
      [advanceMonths, enabled, emailNotifications, smsNotifications, notificationFrequency]
    );
    
    return NextResponse.json(
      { message: "Configuration updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT config error:", error);
    return NextResponse.json(
      { error: "Failed to update certificate alert configuration" },
      { status: 500 }
    );
  }
}
