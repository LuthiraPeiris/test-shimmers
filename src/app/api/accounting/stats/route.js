// app/api/accounting/stats/route.js - Advanced accounting statistics
import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../../app/lib/dbAdapter';

export async function GET(request) {
  let conn;
  
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear();
    const month = searchParams.get('month') || (new Date().getMonth() + 1);
    const period = searchParams.get('period') || 'current-month';

    conn = await getDBConnection();

    // Get basic account statistics
    const [accountStats] = await conn.query(
      `SELECT 
         COUNT(*) as total_accounts,
         SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active_accounts,
         SUM(CASE WHEN account_type = 'ASSET' THEN balance ELSE 0 END) as total_assets,
         SUM(CASE WHEN account_type = 'LIABILITY' THEN balance ELSE 0 END) as total_liabilities,
         SUM(CASE WHEN account_type = 'EQUITY' THEN balance ELSE 0 END) as total_equity,
         SUM(CASE WHEN account_type = 'INCOME' THEN balance ELSE 0 END) as total_income,
         SUM(CASE WHEN account_type = 'EXPENSE' THEN balance ELSE 0 END) as total_expenses
       FROM chart_of_accounts`
    );

    // Get account type breakdown
    const [accountTypeBreakdown] = await conn.query(
      `SELECT 
         account_type,
         COUNT(*) as account_count,
         SUM(balance) as total_balance,
         AVG(balance) as avg_balance
       FROM chart_of_accounts 
       WHERE status = 'ACTIVE'
       GROUP BY account_type
       ORDER BY total_balance DESC`
    );

    // Get journal entry statistics
    const [journalStats] = await conn.query(
      `SELECT 
         COUNT(*) as total_entries,
         SUM(CASE WHEN status = 'DRAFT' THEN 1 ELSE 0 END) as draft_entries,
         SUM(CASE WHEN status = 'POSTED' THEN 1 ELSE 0 END) as posted_entries,
         SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_entries,
         SUM(total_debits) as total_debits_all,
         SUM(total_credits) as total_credits_all,
         AVG(total_debits) as avg_entry_amount
       FROM journal_entries`
    );

    // Get monthly journal entry trend (last 12 months)
    const [monthlyJournalTrend] = await conn.query(
      `SELECT 
         DATE_FORMAT(date, '%Y-%m') as month,
         COUNT(*) as entry_count,
         SUM(total_debits) as total_amount,
         AVG(total_debits) as avg_amount
       FROM journal_entries 
       WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       AND status = 'POSTED'
       GROUP BY DATE_FORMAT(date, '%Y-%m')
       ORDER BY month DESC`
    );

    // Get account activity (transactions in current month)
    const [accountActivity] = await conn.query(
      `SELECT 
         coa.account_name,
         coa.account_type,
         COUNT(ar.id) as transaction_count,
         SUM(ar.debit_amount) as total_debits,
         SUM(ar.credit_amount) as total_credits,
         MAX(ar.date) as last_activity
       FROM chart_of_accounts coa
       LEFT JOIN account_registers ar ON coa.account_id = ar.account_id
         AND YEAR(ar.date) = ? AND MONTH(ar.date) = ?
       WHERE coa.status = 'ACTIVE'
       GROUP BY coa.id, coa.account_name, coa.account_type
       HAVING transaction_count > 0
       ORDER BY transaction_count DESC
       LIMIT 10`,
      [year, month]
    );

    // Get reconciliation status
    const [reconciliationStats] = await conn.query(
      `SELECT 
         COUNT(*) as total_reconciliations,
         SUM(CASE WHEN reconciliation_status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
         SUM(CASE WHEN reconciliation_status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
         SUM(CASE WHEN reconciliation_status = 'PENDING' THEN 1 ELSE 0 END) as pending,
         AVG(reconciled_transactions) as avg_reconciled_items,
         AVG(outstanding_items) as avg_outstanding_items
       FROM reconciliations
       WHERE statement_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)`
    );

    // Get currency usage
    const [currencyStats] = await conn.query(
      `SELECT 
         c.currency_code,
         c.currency_name,
         c.symbol,
         c.exchange_rate,
         COUNT(coa.id) as accounts_using,
         SUM(coa.balance) as total_balance_in_currency
       FROM currencies c
       LEFT JOIN chart_of_accounts coa ON c.currency_id = coa.currency_id
       WHERE c.status = 'ACTIVE'
       GROUP BY c.id, c.currency_code, c.currency_name, c.symbol, c.exchange_rate
       ORDER BY accounts_using DESC`
    );

    // Get opening balance status
    const [openingBalanceStats] = await conn.query(
      `SELECT 
         COUNT(*) as total_opening_balances,
         SUM(debit_balance) as total_opening_debits,
         SUM(credit_balance) as total_opening_credits,
         SUM(CASE WHEN status = 'FINAL' THEN 1 ELSE 0 END) as finalized_balances,
         MAX(opening_balance_date) as latest_opening_date
       FROM opening_balances`
    );

    // Get closing period status
    const [closingPeriodStats] = await conn.query(
      `SELECT 
         COUNT(*) as total_periods,
         SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) as closed_periods,
         SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) as open_periods,
         SUM(revenue_total) as total_revenue_all_periods,
         SUM(expense_total) as total_expenses_all_periods,
         SUM(net_income) as total_net_income_all_periods,
         MAX(closing_period) as latest_period
       FROM closing_periods`
    );

    // Calculate financial ratios (if we have the necessary account types)
    const assets = accountStats[0].total_assets || 0;
    const liabilities = accountStats[0].total_liabilities || 0;
    const equity = accountStats[0].total_equity || 0;
    
    const financialRatios = {
      debt_to_equity: liabilities > 0 && equity > 0 ? (liabilities / equity).toFixed(2) : 0,
      asset_to_liability: assets > 0 && liabilities > 0 ? (assets / liabilities).toFixed(2) : 0,
      equity_ratio: assets > 0 ? ((equity / assets) * 100).toFixed(1) : 0
    };

    // Get recent activity summary
    const [recentActivity] = await conn.query(
      `SELECT 
         'Journal Entry' as activity_type,
         reference_number as reference,
         description,
         total_debits as amount,
         created_at as activity_date,
         created_by as user_name
       FROM journal_entries 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       
       UNION ALL
       
       SELECT 
         'Account Created' as activity_type,
         account_code as reference,
         account_name as description,
         balance as amount,
         created_at as activity_date,
         'System' as user_name
       FROM chart_of_accounts 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       
       ORDER BY activity_date DESC
       LIMIT 15`
    );

    // Prepare response data
    const responseData = {
      summary: {
        totalAccounts: accountStats[0].total_accounts,
        activeAccounts: accountStats[0].active_accounts,
        totalAssets: accountStats[0].total_assets,
        totalLiabilities: accountStats[0].total_liabilities,
        totalEquity: accountStats[0].total_equity,
        totalIncome: accountStats[0].total_income,
        totalExpenses: accountStats[0].total_expenses,
        pendingJournalEntries: journalStats[0].draft_entries,
        activeCurrencies: currencyStats.filter(c => c.accounts_using > 0).length
      },
      
      breakdowns: {
        accountTypes: accountTypeBreakdown,
        journalEntryStatus: {
          total: journalStats[0].total_entries,
          draft: journalStats[0].draft_entries,
          posted: journalStats[0].posted_entries,
          cancelled: journalStats[0].cancelled_entries
        },
        reconciliationStatus: reconciliationStats[0],
        currencyUsage: currencyStats,
        openingBalances: openingBalanceStats[0],
        closingPeriods: closingPeriodStats[0]
      },
      
      trends: {
        monthlyJournalEntries: monthlyJournalTrend,
        accountActivity: accountActivity
      },
      
      insights: {
        financialRatios: financialRatios,
        recentActivity: recentActivity,
        healthChecks: {
          balancedJournalEntries: Math.abs(journalStats[0].total_debits_all - journalStats[0].total_credits_all) < 0.01,
          balancedOpeningBalances: Math.abs(openingBalanceStats[0].total_opening_debits - openingBalanceStats[0].total_opening_credits) < 0.01,
          hasRecentActivity: recentActivity.length > 0,
          allAccountsReconciled: reconciliationStats[0].pending === 0,
          currentPeriodOpen: closingPeriodStats[0].open_periods > 0
        }
      },
      
      meta: {
        generatedAt: new Date().toISOString(),
        reportPeriod: {
          year: parseInt(year),
          month: parseInt(month),
          period: period
        },
        dataFreshness: {
          accounts: 'real-time',
          journalEntries: 'real-time',
          reconciliations: 'real-time',
          trends: 'daily'
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Accounting statistics retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Accounting stats API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch accounting statistics',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

// POST method for updating period calculations
export async function POST(request) {
  let conn;
  
  try {
    const body = await request.json();
    const { action, period } = body;

    conn = await getDBConnection();

    if (action === 'recalculate-balances') {
      // Recalculate account balances from transaction history
      const [accounts] = await conn.query('SELECT account_id FROM chart_of_accounts WHERE status = "ACTIVE"');
      
      for (const account of accounts) {
        const [balanceResult] = await conn.query(
          `SELECT 
             SUM(debit_amount) - SUM(credit_amount) as calculated_balance
           FROM account_registers 
           WHERE account_id = ?`,
          [account.account_id]
        );
        
        const calculatedBalance = balanceResult[0].calculated_balance || 0;
        
        await conn.execute(
          'UPDATE chart_of_accounts SET balance = ? WHERE account_id = ?',
          [calculatedBalance, account.account_id]
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Account balances recalculated successfully',
        data: { accountsUpdated: accounts.length }
      });
    }

    if (action === 'close-period' && period) {
      // Close an accounting period
      const [periodCheck] = await conn.query(
        'SELECT status FROM closing_periods WHERE closing_period = ?',
        [period]
      );

      if (periodCheck.length === 0) {
        throw new Error('Period not found');
      }

      if (periodCheck[0].status === 'CLOSED') {
        throw new Error('Period is already closed');
      }

      // Calculate period totals
      const [periodTotals] = await conn.query(
        `SELECT 
           SUM(CASE WHEN coa.account_type = 'INCOME' THEN ar.credit_amount - ar.debit_amount ELSE 0 END) as revenue_total,
           SUM(CASE WHEN coa.account_type = 'EXPENSE' THEN ar.debit_amount - ar.credit_amount ELSE 0 END) as expense_total
         FROM account_registers ar
         JOIN chart_of_accounts coa ON ar.account_id = coa.account_id
         WHERE DATE_FORMAT(ar.date, '%Y-%m') = ?`,
        [period]
      );

      const revenueTotal = periodTotals[0].revenue_total || 0;
      const expenseTotal = periodTotals[0].expense_total || 0;
      const netIncome = revenueTotal - expenseTotal;

      await conn.execute(
        `UPDATE closing_periods 
         SET status = 'CLOSED', 
             closing_date = CURDATE(),
             revenue_total = ?,
             expense_total = ?,
             net_income = ?,
             retained_earnings_adjustment = ?,
             closed_by = 'System'
         WHERE closing_period = ?`,
        [revenueTotal, expenseTotal, netIncome, netIncome, period]
      );

      return NextResponse.json({
        success: true,
        message: 'Period closed successfully',
        data: {
          period,
          revenueTotal,
          expenseTotal,
          netIncome
        }
      });
    }

    throw new Error('Invalid action specified');

  } catch (error) {
    console.error('Accounting stats POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process request',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}