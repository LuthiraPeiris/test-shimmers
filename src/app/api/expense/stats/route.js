// api/expense/stats/route.js - Updated for Lambda integration
import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../lib/dbAdapter.ts';

export async function GET(request) {
  let conn;
  
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear();
    const month = searchParams.get('month') || (new Date().getMonth() + 1);

    // Get database connection
    conn = await getDBConnection();

    // Get total expenses count
    const [totalExpensesResult] = await conn.query(
      'SELECT COUNT(*) as total FROM expenses'
    );

    // Get current month total
    const [monthlyTotalResult] = await conn.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE YEAR(expense_date) = ? AND MONTH(expense_date) = ?`,
      [year, month]
    );

    // Get pending approval count
    const [pendingResult] = await conn.query(
      'SELECT COUNT(*) as total FROM expenses WHERE status = "PENDING"'
    );

    // Get active recurring expenses total
    const [recurringTotalResult] = await conn.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM recurring_expenses WHERE status = "ACTIVE"'
    );

    // Get monthly expenses by category
    const [categoryBreakdown] = await conn.query(
      `SELECT expense_category, COALESCE(SUM(amount), 0) as total, COUNT(*) as count
       FROM expenses 
       WHERE YEAR(expense_date) = ? AND MONTH(expense_date) = ?
       GROUP BY expense_category
       ORDER BY total DESC`,
      [year, month]
    );

    // Get recent expenses trend (last 6 months)
    const [trendData] = await conn.query(
      `SELECT 
         DATE_FORMAT(expense_date, '%Y-%m') as month,
         COALESCE(SUM(amount), 0) as total,
         COUNT(*) as count
       FROM expenses 
       WHERE expense_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
       ORDER BY month DESC`
    );

    // Get payment method breakdown
    const [paymentMethods] = await conn.query(
      `SELECT payment_method, COALESCE(SUM(amount), 0) as total, COUNT(*) as count
       FROM expenses 
       WHERE YEAR(expense_date) = ? AND MONTH(expense_date) = ?
       GROUP BY payment_method
       ORDER BY total DESC`,
      [year, month]
    );

    // Get top expenses for current month
    const [topExpenses] = await conn.query(
      `SELECT expense_id, payee_name, expense_category, amount, expense_date
       FROM expenses 
       WHERE YEAR(expense_date) = ? AND MONTH(expense_date) = ?
       ORDER BY amount DESC
       LIMIT 5`,
      [year, month]
    );

    // Calculate month-over-month change
    const prevMonth = month == 1 ? 12 : month - 1;
    const prevYear = month == 1 ? year - 1 : year;
    
    const [prevMonthTotal] = await conn.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE YEAR(expense_date) = ? AND MONTH(expense_date) = ?`,
      [prevYear, prevMonth]
    );

    const currentTotal = monthlyTotalResult[0].total;
    const previousTotal = prevMonthTotal[0].total;
    const monthlyChange = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1)
      : 0;

    // Get expense status breakdown
    const [statusBreakdown] = await conn.query(
      `SELECT status, COUNT(*) as count, COALESCE(SUM(amount), 0) as total
       FROM expenses 
       WHERE YEAR(expense_date) = ? AND MONTH(expense_date) = ?
       GROUP BY status`,
      [year, month]
    );

    // Get upcoming recurring expenses (next 30 days)
    const [upcomingRecurring] = await conn.query(
      `SELECT recurring_expense_id, payee_name, amount, frequency, next_payment_date
       FROM recurring_expenses 
       WHERE status = 'ACTIVE' 
       AND next_payment_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       ORDER BY next_payment_date ASC
       LIMIT 10`
    );

    // Get recent activity (last 10 expenses)
    const [recentActivity] = await conn.query(
      `SELECT expense_id, payee_name, amount, expense_date, status, expense_category
       FROM expenses 
       ORDER BY created_at DESC 
       LIMIT 10`
    );

    return NextResponse.json({
      summary: {
        totalExpenses: totalExpensesResult[0].total,
        monthlyTotal: currentTotal,
        pendingApproval: pendingResult[0].total,
        recurringTotal: recurringTotalResult[0].total,
        monthlyChange: {
          percentage: monthlyChange,
          trend: monthlyChange >= 0 ? 'up' : 'down'
        }
      },
      breakdown: {
        categories: categoryBreakdown,
        paymentMethods: paymentMethods,
        monthlyTrend: trendData,
        topExpenses: topExpenses,
        statusBreakdown: statusBreakdown
      },
      insights: {
        upcomingRecurring: upcomingRecurring,
        recentActivity: recentActivity
      },
      meta: {
        generatedAt: new Date().toISOString(),
        reportPeriod: {
          year: parseInt(year),
          month: parseInt(month)
        }
      }
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}