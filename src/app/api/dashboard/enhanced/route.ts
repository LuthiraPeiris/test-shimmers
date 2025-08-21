import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/dbAdapter';

// Enhanced dashboard API with real database connections
export async function GET() {
  try {
    const pool = await getDBConnection();
    
    // Fetch dashboard metrics with real queries
    const [
      productsResult,
      suppliersResult,
      purchaseOrdersResult,
      salesOrdersResult,
      lowStockResult,
      expiringItemsResult,
      pendingApprovalsResult
    ] = await Promise.all([
      // Total products count
      pool.query("SELECT COUNT(*) as total FROM item_master_data"),
      
      // Active suppliers count
      pool.query("SELECT COUNT(*) as total FROM supplier_data WHERE Status = 'Active'"),
      
      // Today's purchase orders
      pool.query(`
        SELECT COUNT(*) as total, SUM(TotValue) as totalValue 
        FROM purchase_order 
        WHERE DATE(Created_Date) = CURDATE()
      `),
      
      // Today's sales orders
      pool.query(`
        SELECT COUNT(*) as total, SUM(Total_Amount) as totalValue 
        FROM sales_order 
        WHERE DATE(Created_Date) = CURDATE()
      `),
      
      // Low stock alerts
      pool.query(`
        SELECT Item_Code, Item_Name, Available_Stock, Minimum_Stock_Level 
        FROM item_master_data 
        WHERE Available_Stock <= Minimum_Stock_Level
      `),
      
      // Expiring items (next 30 days)
      pool.query(`
        SELECT Item_Code, Item_Name, Expiry_Date, DATEDIFF(Expiry_Date, CURDATE()) as daysLeft
        FROM item_master_data 
        WHERE Expiry_Date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      `),
      
      // Pending approvals
      pool.query(`
        SELECT COUNT(*) as total 
        FROM purchase_order 
        WHERE Status = 'Pending'
      `)
    ]);

    return NextResponse.json({
      totalProducts: productsResult[0][0].total,
      lowStockAlerts: lowStockResult[0].length,
      inventoryValue: 1.2, // Will calculate from actual data
      ordersToday: salesOrdersResult[0][0].total,
      activeSuppliers: suppliersResult[0][0].total,
      pendingApprovals: pendingApprovalsResult[0][0].total,
      lowStockItems: lowStockResult[0],
      expiringItems: expiringItemsResult[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', success: false },
      { status: 500 }
    );
  }
}
