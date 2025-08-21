// app/api/accounting/route.js - Main accounting API routes
import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../app/lib/dbAdapter.ts';

// Helper function to validate required fields
function validateRequired(data, requiredFields) {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

// Helper function to format response
function formatResponse(data, message = 'Success') {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  });
}

// Helper function to handle errors
function handleError(error, context = 'Operation') {
  console.error(`${context} error:`, error);
  return NextResponse.json({
    success: false,
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString()
  }, { status: 500 });
}

// ========== GET - Fetch all accounting data ==========
export async function GET(request) {
  let conn;
  
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const limit = searchParams.get('limit') || 100;
    const offset = searchParams.get('offset') || 0;

    conn = await getDBConnection();

    if (type === 'chart-of-accounts') {
      const [accounts] = await conn.query(
        `SELECT coa.*, c.currency_code, c.symbol as currency_symbol 
         FROM chart_of_accounts coa
         LEFT JOIN currencies c ON coa.currency_id = c.currency_id
         ORDER BY coa.account_code
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
      );
      return formatResponse(accounts);
    }

    if (type === 'account-registers') {
      const accountId = searchParams.get('account_id');
      let query = `
        SELECT ar.*, coa.account_type, coa.account_subtype
        FROM account_registers ar
        LEFT JOIN chart_of_accounts coa ON ar.account_id = coa.account_id
      `;
      let params = [];
      
      if (accountId) {
        query += ' WHERE ar.account_id = ?';
        params.push(accountId);
      }
      
      query += ' ORDER BY ar.date DESC, ar.id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [registers] = await conn.query(query, params);
      return formatResponse(registers);
    }

    if (type === 'journal-entries') {
      const [entries] = await conn.query(
        `SELECT je.*, 
         GROUP_CONCAT(
           CONCAT(jel.account_name, ':', jel.debit_amount, ':', jel.credit_amount) 
           SEPARATOR '|'
         ) as entry_lines
         FROM journal_entries je
         LEFT JOIN journal_entry_lines jel ON je.journal_entry_id = jel.journal_entry_id
         GROUP BY je.id
         ORDER BY je.date DESC, je.id DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
      );
      
      // Format entries with parsed lines
      const formattedEntries = entries.map(entry => ({
        ...entry,
        entries: entry.entry_lines ? entry.entry_lines.split('|').map(line => {
          const [account, debit, credit] = line.split(':');
          return {
            account_name: account,
            debit: parseFloat(debit) || 0,
            credit: parseFloat(credit) || 0
          };
        }) : []
      }));
      
      return formatResponse(formattedEntries);
    }

    if (type === 'reconciliations') {
      const [reconciliations] = await conn.query(
        `SELECT r.*, coa.account_type, coa.account_subtype
         FROM reconciliations r
         LEFT JOIN chart_of_accounts coa ON r.account_id = coa.account_id
         ORDER BY r.statement_date DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
      );
      return formatResponse(reconciliations);
    }

    if (type === 'closing-periods') {
      const [periods] = await conn.query(
        'SELECT * FROM closing_periods ORDER BY closing_period DESC LIMIT ? OFFSET ?',
        [parseInt(limit), parseInt(offset)]
      );
      return formatResponse(periods);
    }

    if (type === 'opening-balances') {
      const [balances] = await conn.query(
        `SELECT ob.*, coa.account_type, coa.account_subtype
         FROM opening_balances ob
         LEFT JOIN chart_of_accounts coa ON ob.account_id = coa.account_id
         ORDER BY ob.opening_balance_date DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
      );
      return formatResponse(balances);
    }

    if (type === 'currencies') {
      const [currencies] = await conn.query(
        'SELECT * FROM currencies ORDER BY default_currency DESC, currency_code LIMIT ? OFFSET ?',
        [parseInt(limit), parseInt(offset)]
      );
      return formatResponse(currencies);
    }

    if (type === 'stats') {
      // Get summary statistics
      const [accountStats] = await conn.query(
        `SELECT 
           COUNT(*) as total_accounts,
           SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active_accounts,
           SUM(CASE WHEN account_type = 'ASSET' THEN balance ELSE 0 END) as total_assets,
           SUM(CASE WHEN account_type = 'LIABILITY' THEN balance ELSE 0 END) as total_liabilities
         FROM chart_of_accounts`
      );

      const [journalStats] = await conn.query(
        `SELECT 
           COUNT(*) as total_entries,
           SUM(CASE WHEN status = 'DRAFT' THEN 1 ELSE 0 END) as pending_entries
         FROM journal_entries`
      );

      const [currencyStats] = await conn.query(
        `SELECT 
           COUNT(*) as total_currencies,
           SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active_currencies
         FROM currencies`
      );

      const stats = {
        totalAccounts: accountStats[0].total_accounts,
        activeAccounts: accountStats[0].active_accounts,
        totalAssets: accountStats[0].total_assets,
        totalLiabilities: accountStats[0].total_liabilities,
        pendingJournalEntries: journalStats[0].pending_entries,
        activeCurrencies: currencyStats[0].active_currencies
      };

      return formatResponse(stats);
    }

    // Default: return all data types summary
    const [accountCount] = await conn.query('SELECT COUNT(*) as count FROM chart_of_accounts');
    const [journalCount] = await conn.query('SELECT COUNT(*) as count FROM journal_entries');
    const [reconCount] = await conn.query('SELECT COUNT(*) as count FROM reconciliations');

    return formatResponse({
      accounts: accountCount[0].count,
      journalEntries: journalCount[0].count,
      reconciliations: reconCount[0].count
    });

  } catch (error) {
    return handleError(error, 'GET accounting data');
  } finally {
    if (conn) await conn.end();
  }
}

// ========== POST - Create new accounting records ==========
export async function POST(request) {
  let conn;
  
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (!type) {
      throw new Error('Type is required');
    }

    conn = await getDBConnection();

    if (type === 'chart-of-accounts') {
      validateRequired(data, ['account_code', 'account_name', 'account_type']);
      
      // Generate account_id
      const account_id = `ACC${String(Date.now()).slice(-6)}`;
      
      const [result] = await conn.execute(
        `INSERT INTO chart_of_accounts 
         (account_id, account_code, account_name, account_type, account_subtype, 
          parent_account, description, tax_code, currency_id, status, created_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
        [
          account_id,
          data.account_code,
          data.account_name,
          data.account_type,
          data.account_subtype || null,
          data.parent_account || null,
          data.description || null,
          data.tax_code || null,
          data.currency_id || 'CUR001',
          data.status || 'ACTIVE'
        ]
      );

      return formatResponse({ id: result.insertId, account_id }, 'Account created successfully');
    }

    if (type === 'journal-entry') {
      validateRequired(data, ['date', 'reference_number', 'description', 'entries']);
      
      if (!Array.isArray(data.entries) || data.entries.length === 0) {
        throw new Error('Journal entries must have at least one entry line');
      }

      // Calculate totals
      const totalDebits = data.entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
      const totalCredits = data.entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
      
      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        throw new Error('Journal entry is not balanced. Debits must equal credits.');
      }

      // Generate journal_entry_id
      const journal_entry_id = `JE${String(Date.now()).slice(-6)}`;

      // Insert journal entry header
      const [jeResult] = await conn.execute(
        `INSERT INTO journal_entries 
         (journal_entry_id, date, reference_number, description, total_debits, total_credits, 
          status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          journal_entry_id,
          data.date,
          data.reference_number,
          data.description,
          totalDebits,
          totalCredits,
          data.status || 'DRAFT',
          data.created_by || 'System'
        ]
      );

      // Insert journal entry lines
      for (let i = 0; i < data.entries.length; i++) {
        const entry = data.entries[i];
        await conn.execute(
          `INSERT INTO journal_entry_lines 
           (journal_entry_id, line_number, account_id, account_name, description, 
            debit_amount, credit_amount)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            journal_entry_id,
            i + 1,
            entry.account_id || entry.account,
            entry.account_name || entry.account,
            entry.description || data.description,
            parseFloat(entry.debit) || 0,
            parseFloat(entry.credit) || 0
          ]
        );

        // Create account register entries if journal is posted
        if (data.status === 'POSTED') {
          const transaction_id = `TXN${String(Date.now() + i).slice(-6)}`;
          
          // Get current account balance
          const [balanceResult] = await conn.query(
            'SELECT balance FROM chart_of_accounts WHERE account_id = ?',
            [entry.account_id || entry.account]
          );
          
          const currentBalance = balanceResult[0]?.balance || 0;
          const debitAmount = parseFloat(entry.debit) || 0;
          const creditAmount = parseFloat(entry.credit) || 0;
          const newBalance = currentBalance + debitAmount - creditAmount;

          await conn.execute(
            `INSERT INTO account_registers 
             (transaction_id, date, account_id, account_name, reference_number, 
              description, debit_amount, credit_amount, running_balance, 
              source_document, journal_entry_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              transaction_id,
              data.date,
              entry.account_id || entry.account,
              entry.account_name || entry.account,
              data.reference_number,
              entry.description || data.description,
              debitAmount,
              creditAmount,
              newBalance,
              `Journal Entry ${data.reference_number}`,
              journal_entry_id
            ]
          );

          // Update account balance
          await conn.execute(
            'UPDATE chart_of_accounts SET balance = ? WHERE account_id = ?',
            [newBalance, entry.account_id || entry.account]
          );
        }
      }

      return formatResponse({ 
        id: jeResult.insertId, 
        journal_entry_id,
        total_debits: totalDebits,
        total_credits: totalCredits
      }, 'Journal entry created successfully');
    }

    if (type === 'currency') {
      validateRequired(data, ['currency_code', 'currency_name', 'symbol', 'exchange_rate']);
      
      const currency_id = `CUR${String(Date.now()).slice(-6)}`;
      
      const [result] = await conn.execute(
        `INSERT INTO currencies 
         (currency_id, currency_code, currency_name, symbol, exchange_rate, 
          rate_date, default_currency, status)
         VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?)`,
        [
          currency_id,
          data.currency_code,
          data.currency_name,
          data.symbol,
          data.exchange_rate,
          data.default_currency || false,
          data.status || 'ACTIVE'
        ]
      );

      return formatResponse({ id: result.insertId, currency_id }, 'Currency created successfully');
    }

    if (type === 'reconciliation') {
      validateRequired(data, ['account_id', 'account_name', 'statement_date', 'beginning_balance', 'ending_balance']);
      
      const reconciliation_id = `REC${String(Date.now()).slice(-6)}`;
      
      const [result] = await conn.execute(
        `INSERT INTO reconciliations 
         (reconciliation_id, account_id, account_name, statement_date, 
          beginning_balance, ending_balance, reconciled_transactions, 
          outstanding_items, adjustments, reconciliation_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reconciliation_id,
          data.account_id,
          data.account_name,
          data.statement_date,
          data.beginning_balance,
          data.ending_balance,
          data.reconciled_transactions || 0,
          data.outstanding_items || 0,
          data.adjustments || 0,
          data.reconciliation_status || 'PENDING'
        ]
      );

      return formatResponse({ id: result.insertId, reconciliation_id }, 'Reconciliation created successfully');
    }

    if (type === 'opening-balance') {
      validateRequired(data, ['account_id', 'account_name', 'opening_balance_date']);
      
      const [result] = await conn.execute(
        `INSERT INTO opening_balances 
         (account_id, account_name, opening_balance_date, debit_balance, 
          credit_balance, reference, status, created_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
        [
          data.account_id,
          data.account_name,
          data.opening_balance_date,
          data.debit_balance || 0,
          data.credit_balance || 0,
          data.reference || 'Opening Balance Entry',
          data.status || 'ACTIVE'
        ]
      );

      return formatResponse({ id: result.insertId }, 'Opening balance created successfully');
    }

    throw new Error(`Unsupported type: ${type}`);

  } catch (error) {
    return handleError(error, 'POST accounting data');
  } finally {
    if (conn) await conn.end();
  }
}

// ========== PUT - Update existing accounting records ==========
export async function PUT(request) {
  let conn;
  
  try {
    const body = await request.json();
    const { type, id, ...data } = body;

    if (!type || !id) {
      throw new Error('Type and ID are required');
    }

    conn = await getDBConnection();

    if (type === 'chart-of-accounts') {
      const [result] = await conn.execute(
        `UPDATE chart_of_accounts 
         SET account_code = ?, account_name = ?, account_type = ?, 
             account_subtype = ?, parent_account = ?, description = ?, 
             tax_code = ?, currency_id = ?, status = ?
         WHERE id = ?`,
        [
          data.account_code,
          data.account_name,
          data.account_type,
          data.account_subtype || null,
          data.parent_account || null,
          data.description || null,
          data.tax_code || null,
          data.currency_id || 'CUR001',
          data.status || 'ACTIVE',
          id
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error('Account not found');
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Account updated successfully');
    }

    if (type === 'journal-entry') {
      // Update journal entry header
      const [result] = await conn.execute(
        `UPDATE journal_entries 
         SET date = ?, reference_number = ?, description = ?, status = ?
         WHERE id = ?`,
        [
          data.date,
          data.reference_number,
          data.description,
          data.status,
          id
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error('Journal entry not found');
      }

      // If entries are provided, update them
      if (data.entries && Array.isArray(data.entries)) {
        // Get journal_entry_id
        const [jeData] = await conn.query(
          'SELECT journal_entry_id FROM journal_entries WHERE id = ?',
          [id]
        );

        if (jeData.length === 0) {
          throw new Error('Journal entry not found');
        }

        const journal_entry_id = jeData[0].journal_entry_id;

        // Delete existing lines
        await conn.execute(
          'DELETE FROM journal_entry_lines WHERE journal_entry_id = ?',
          [journal_entry_id]
        );

        // Calculate new totals
        const totalDebits = data.entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
        const totalCredits = data.entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);

        // Insert new lines
        for (let i = 0; i < data.entries.length; i++) {
          const entry = data.entries[i];
          await conn.execute(
            `INSERT INTO journal_entry_lines 
             (journal_entry_id, line_number, account_id, account_name, description, 
              debit_amount, credit_amount)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              journal_entry_id,
              i + 1,
              entry.account_id || entry.account,
              entry.account_name || entry.account,
              entry.description || data.description,
              parseFloat(entry.debit) || 0,
              parseFloat(entry.credit) || 0
            ]
          );
        }

        // Update totals
        await conn.execute(
          'UPDATE journal_entries SET total_debits = ?, total_credits = ? WHERE id = ?',
          [totalDebits, totalCredits, id]
        );
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Journal entry updated successfully');
    }

    if (type === 'currency') {
      const [result] = await conn.execute(
        `UPDATE currencies 
         SET currency_code = ?, currency_name = ?, symbol = ?, 
             exchange_rate = ?, default_currency = ?, status = ?, rate_date = CURDATE()
         WHERE id = ?`,
        [
          data.currency_code,
          data.currency_name,
          data.symbol,
          data.exchange_rate,
          data.default_currency || false,
          data.status || 'ACTIVE',
          id
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error('Currency not found');
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Currency updated successfully');
    }

    if (type === 'reconciliation') {
      const [result] = await conn.execute(
        `UPDATE reconciliations 
         SET account_name = ?, statement_date = ?, beginning_balance = ?, 
             ending_balance = ?, reconciled_transactions = ?, outstanding_items = ?, 
             adjustments = ?, reconciliation_status = ?
         WHERE id = ?`,
        [
          data.account_name,
          data.statement_date,
          data.beginning_balance,
          data.ending_balance,
          data.reconciled_transactions || 0,
          data.outstanding_items || 0,
          data.adjustments || 0,
          data.reconciliation_status || 'PENDING',
          id
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error('Reconciliation not found');
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Reconciliation updated successfully');
    }

    if (type === 'opening-balance') {
      const [result] = await conn.execute(
        `UPDATE opening_balances 
         SET account_name = ?, opening_balance_date = ?, debit_balance = ?, 
             credit_balance = ?, reference = ?, status = ?
         WHERE id = ?`,
        [
          data.account_name,
          data.opening_balance_date,
          data.debit_balance || 0,
          data.credit_balance || 0,
          data.reference || 'Opening Balance Entry',
          data.status || 'ACTIVE',
          id
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error('Opening balance not found');
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Opening balance updated successfully');
    }

    throw new Error(`Unsupported type: ${type}`);

  } catch (error) {
    return handleError(error, 'PUT accounting data');
  } finally {
    if (conn) await conn.end();
  }
}

// ========== DELETE - Delete accounting records ==========
export async function DELETE(request) {
  let conn;
  
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      throw new Error('Type and ID are required');
    }

    conn = await getDBConnection();

    if (type === 'chart-of-accounts') {
      // Check if account is used in any transactions
      const [usageCheck] = await conn.query(
        'SELECT COUNT(*) as count FROM account_registers WHERE account_id = (SELECT account_id FROM chart_of_accounts WHERE id = ?)',
        [id]
      );

      if (usageCheck[0].count > 0) {
        throw new Error('Cannot delete account with existing transactions');
      }

      const [result] = await conn.execute(
        'DELETE FROM chart_of_accounts WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Account not found');
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Account deleted successfully');
    }

    if (type === 'journal-entry') {
      // Check if journal entry is posted
      const [statusCheck] = await conn.query(
        'SELECT status FROM journal_entries WHERE id = ?',
        [id]
      );

      if (statusCheck.length === 0) {
        throw new Error('Journal entry not found');
      }

      if (statusCheck[0].status === 'POSTED') {
        throw new Error('Cannot delete posted journal entries');
      }

      const [result] = await conn.execute(
        'DELETE FROM journal_entries WHERE id = ?',
        [id]
      );

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Journal entry deleted successfully');
    }

    if (type === 'currency') {
      // Check if currency is used in any accounts
      const [usageCheck] = await conn.query(
        'SELECT COUNT(*) as count FROM chart_of_accounts WHERE currency_id = (SELECT currency_id FROM currencies WHERE id = ?)',
        [id]
      );

      if (usageCheck[0].count > 0) {
        throw new Error('Cannot delete currency used by accounts');
      }

      const [result] = await conn.execute(
        'DELETE FROM currencies WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Currency not found');
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Currency deleted successfully');
    }

    if (type === 'reconciliation') {
      const [result] = await conn.execute(
        'DELETE FROM reconciliations WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Reconciliation not found');
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Reconciliation deleted successfully');
    }

    if (type === 'opening-balance') {
      const [result] = await conn.execute(
        'DELETE FROM opening_balances WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Opening balance not found');
      }

      return formatResponse({ id, affectedRows: result.affectedRows }, 'Opening balance deleted successfully');
    }

    throw new Error(`Unsupported type: ${type}`);

  } catch (error) {
    return handleError(error, 'DELETE accounting data');
  } finally {
    if (conn) await conn.end();
  }
}