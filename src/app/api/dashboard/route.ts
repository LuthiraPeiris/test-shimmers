import { NextRequest, NextResponse } from 'next/server';

// Mock API endpoint for dashboard data
// In production, this would connect to your actual database
export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const dashboardData = {
      totalProducts: 2847,
      lowStockAlerts: 23,
      inventoryValue: 1.2,
      ordersToday: 156,
      activeSuppliers: 47,
      pendingApprovals: 12,
      timestamp: new Date().toISOString()
    };

    const alertsData = {
      expiryAlerts: [
        {
          id: 1,
          name: "Milk Powder A1",
          expiry: "2024-08-20",
          sku: "MP-001",
          days: 6,
          severity: "critical"
        },
        {
          id: 2,
          name: "Vitamins B Complex",
          expiry: "2024-08-25",
          sku: "VB-102",
          days: 11,
          severity: "warning"
        },
        {
          id: 3,
          name: "Protein Shake Mix",
          expiry: "2024-09-01",
          sku: "PS-205",
          days: 18,
          severity: "info"
        }
      ],
      lowStockAlerts: [
        {
          id: 1,
          name: "Widget Pro Max",
          current: 5,
          minimum: 50,
          severity: "critical"
        },
        {
          id: 2,
          name: "Smart Device X",
          current: 15,
          minimum: 30,
          severity: "warning"
        },
        {
          id: 3,
          name: "Component Alpha",
          current: 22,
          minimum: 25,
          severity: "info"
        }
      ],
      certificationAlerts: [
        {
          id: 1,
          name: "ISO 9001:2015",
          expiry: "2024-08-30",
          company: "TechCorp Ltd",
          days: 16,
          severity: "critical"
        },
        {
          id: 2,
          name: "FDA Approval",
          expiry: "2024-09-15",
          company: "Global Supply Co",
          days: 32,
          severity: "warning"
        },
        {
          id: 3,
          name: "CE Marking",
          expiry: "2024-10-01",
          company: "Industrial Parts Inc",
          days: 48,
          severity: "info"
        }
      ]
    };

    const statsData = {
      topProducts: [
        { name: "Widget Pro Max", units: 1234 },
        { name: "Smart Device X", units: 987 },
        { name: "Component Alpha", units: 756 }
      ],
      topSuppliers: [
        { name: "TechCorp Ltd", rating: 98.5 },
        { name: "Global Supply Co", rating: 97.2 },
        { name: "Industrial Parts Inc", rating: 95.8 }
      ],
      orderStatus: [
        { status: "Completed", count: 142, color: "text-green-600" },
        { status: "In Progress", count: 28, color: "text-blue-600" },
        { status: "Pending", count: 12, color: "text-yellow-600" }
      ]
    };

    const notifications = [
      {
        id: 1,
        message: "Item expiry alert: Milk Powder A1",
        time: "2 minutes ago",
        type: "critical",
        icon: "expiry"
      },
      {
        id: 2,
        message: "Low stock: Widget Pro Max",
        time: "1 hour ago",
        type: "warning",
        icon: "stock"
      },
      {
        id: 3,
        message: "Certificate expiring: ISO 9001:2015",
        time: "3 hours ago",
        type: "info",
        icon: "certificate"
      }
    ];

    return NextResponse.json({
      dashboardData,
      alertsData,
      statsData,
      notifications,
      success: true
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', success: false },
      { status: 500 }
    );
  }
}
