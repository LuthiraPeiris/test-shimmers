// api/expense/route.js - Updated for Lambda integration
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../lib/dbAdapter.ts';
import path from 'path';
import fs from 'fs/promises';

// Helper function to handle database errors
const handleDBError = (error) => {
  console.error('Database error:', error);
  return NextResponse.json(
    { error: 'Database operation failed', details: error.message },
    { status: 500 }
  );
};

// Helper function to save file
const saveFile = async (file, category = 'expenses') => {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', category);
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await fs.writeFile(filePath, buffer);
    
    return `/uploads/${category}/${fileName}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to save file');
  }
};

// GET - Fetch expenses with filters
export async function GET(request) {
  let conn;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const type = searchParams.get('type'); // 'expenses' or 'recurring'

    const offset = (page - 1) * limit;
    
    // Get database connection
    conn = await getDBConnection();
    
    let query;
    let countQuery;
    let params = [];
    let countParams = [];

    if (type === 'recurring') {
      // Fetch recurring expenses
      query = `
        SELECT re.*, 
               DATE_FORMAT(re.start_date, '%Y-%m-%d') as start_date,
               DATE_FORMAT(re.end_date, '%Y-%m-%d') as end_date,
               DATE_FORMAT(re.next_payment_date, '%Y-%m-%d') as next_payment_date,
               DATE_FORMAT(re.last_generated_date, '%Y-%m-%d') as last_generated_date
        FROM recurring_expenses re 
        WHERE 1=1
      `;
      
      countQuery = 'SELECT COUNT(*) as total FROM recurring_expenses WHERE 1=1';

      if (search) {
        query += ' AND (re.payee_name LIKE ? OR re.recurring_expense_id LIKE ?)';
        countQuery += ' AND (payee_name LIKE ? OR recurring_expense_id LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm);
      }

      if (category) {
        query += ' AND re.expense_category = ?';
        countQuery += ' AND expense_category = ?';
        params.push(category);
        countParams.push(category);
      }

      if (status) {
        query += ' AND re.status = ?';
        countQuery += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }

      query += ' ORDER BY re.next_payment_date DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

    } else {
      // Fetch regular expenses
      query = `
        SELECT e.*, 
               DATE_FORMAT(e.expense_date, '%Y-%m-%d') as expense_date,
               DATE_FORMAT(e.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
               DATE_FORMAT(e.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
        FROM expenses e 
        WHERE 1=1
      `;
      
      countQuery = 'SELECT COUNT(*) as total FROM expenses WHERE 1=1';

      if (search) {
        query += ' AND (e.payee_name LIKE ? OR e.expense_id LIKE ? OR e.expense_category LIKE ?)';
        countQuery += ' AND (payee_name LIKE ? OR expense_id LIKE ? OR expense_category LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm, searchTerm);
      }

      if (category) {
        query += ' AND e.expense_category = ?';
        countQuery += ' AND expense_category = ?';
        params.push(category);
        countParams.push(category);
      }

      if (status) {
        query += ' AND e.status = ?';
        countQuery += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }

      if (startDate) {
        query += ' AND e.expense_date >= ?';
        countQuery += ' AND expense_date >= ?';
        params.push(startDate);
        countParams.push(startDate);
      }

      if (endDate) {
        query += ' AND e.expense_date <= ?';
        countQuery += ' AND expense_date <= ?';
        params.push(endDate);
        countParams.push(endDate);
      }

      query += ' ORDER BY e.expense_date DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    console.log('Executing query:', query);
    console.log('With params:', params);

    const [rows] = await conn.query(query, params);
    const [countResult] = await conn.query(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('GET request error:', error);
    return handleDBError(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

// POST - Create new expense or recurring expense
export async function POST(request) {
  let conn;
  
  try {
    const formData = await request.formData();
    const type = formData.get('type'); // 'expense' or 'recurring'
    
    // Get database connection
    conn = await getDBConnection();
    
    if (type === 'recurring') {
      // Create recurring expense
      const recurringData = {
        payee_name: formData.get('payee_name'),
        expense_category: formData.get('expense_category'),
        amount: parseFloat(formData.get('amount')),
        frequency: formData.get('frequency'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date') || null,
        payment_method: formData.get('payment_method'),
        notes: formData.get('notes') || null,
      };

      // Calculate next payment date based on start date and frequency
      const nextPaymentDate = recurringData.start_date;

      const query = `
        INSERT INTO recurring_expenses 
        (payee_name, expense_category, amount, frequency, start_date, end_date, 
         payment_method, notes, next_payment_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await conn.execute(query, [
        recurringData.payee_name,
        recurringData.expense_category,
        recurringData.amount,
        recurringData.frequency,
        recurringData.start_date,
        recurringData.end_date,
        recurringData.payment_method,
        recurringData.notes,
        nextPaymentDate
      ]);

      // Fetch the created recurring expense
      const [createdRecurring] = await conn.query(
        'SELECT * FROM recurring_expenses WHERE id = ?',
        [result.insertId]
      );

      return NextResponse.json({
        message: 'Recurring expense created successfully',
        data: createdRecurring[0]
      }, { status: 201 });

    } else {
      // Create regular expense
      const expenseData = {
        expense_date: formData.get('expense_date'),
        payee_name: formData.get('payee_name'),
        expense_category: formData.get('expense_category'),
        payment_method: formData.get('payment_method'),
        amount: parseFloat(formData.get('amount')),
        notes: formData.get('notes') || null,
      };

      // Handle file upload
      let receiptPath = null;
      const receiptFile = formData.get('receipt_attachment');
      if (receiptFile && receiptFile.size > 0) {
        receiptPath = await saveFile(receiptFile, 'receipts');
      }

      const query = `
        INSERT INTO expenses 
        (expense_date, payee_name, expense_category, payment_method, amount, notes, receipt_attachment) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await conn.execute(query, [
        expenseData.expense_date,
        expenseData.payee_name,
        expenseData.expense_category,
        expenseData.payment_method,
        expenseData.amount,
        expenseData.notes,
        receiptPath
      ]);

      // Fetch the created expense
      const [createdExpense] = await conn.query(
        'SELECT *, DATE_FORMAT(expense_date, "%Y-%m-%d") as expense_date FROM expenses WHERE id = ?',
        [result.insertId]
      );

      return NextResponse.json({
        message: 'Expense created successfully',
        data: createdExpense[0]
      }, { status: 201 });
    }

  } catch (error) {
    console.error('POST request error:', error);
    return handleDBError(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

// PUT - Update expense or recurring expense
export async function PUT(request) {
  let conn;
  
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const type = formData.get('type'); // 'expense' or 'recurring'

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get database connection
    conn = await getDBConnection();

    if (type === 'recurring') {
      // Update recurring expense
      const updateData = {
        payee_name: formData.get('payee_name'),
        expense_category: formData.get('expense_category'),
        amount: parseFloat(formData.get('amount')),
        frequency: formData.get('frequency'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date') || null,
        payment_method: formData.get('payment_method'),
        notes: formData.get('notes') || null,
        status: formData.get('status') || 'ACTIVE'
      };

      const query = `
        UPDATE recurring_expenses 
        SET payee_name=?, expense_category=?, amount=?, frequency=?, 
            start_date=?, end_date=?, payment_method=?, notes=?, status=?, 
            updated_at=CURRENT_TIMESTAMP
        WHERE id=?
      `;

      await conn.execute(query, [
        updateData.payee_name,
        updateData.expense_category,
        updateData.amount,
        updateData.frequency,
        updateData.start_date,
        updateData.end_date,
        updateData.payment_method,
        updateData.notes,
        updateData.status,
        id
      ]);

    } else {
      // Update regular expense
      const updateData = {
        expense_date: formData.get('expense_date'),
        payee_name: formData.get('payee_name'),
        expense_category: formData.get('expense_category'),
        payment_method: formData.get('payment_method'),
        amount: parseFloat(formData.get('amount')),
        notes: formData.get('notes') || null,
        status: formData.get('status') || 'PENDING'
      };

      // Handle file upload
      let receiptPath = formData.get('existing_receipt_path');
      const receiptFile = formData.get('receipt_attachment');
      if (receiptFile && receiptFile.size > 0) {
        receiptPath = await saveFile(receiptFile, 'receipts');
      }

      const query = `
        UPDATE expenses 
        SET expense_date=?, payee_name=?, expense_category=?, payment_method=?, 
            amount=?, notes=?, receipt_attachment=?, status=?, updated_at=CURRENT_TIMESTAMP
        WHERE id=?
      `;

      await conn.execute(query, [
        updateData.expense_date,
        updateData.payee_name,
        updateData.expense_category,
        updateData.payment_method,
        updateData.amount,
        updateData.notes,
        receiptPath,
        updateData.status,
        id
      ]);
    }

    return NextResponse.json({ message: 'Updated successfully' });

  } catch (error) {
    console.error('PUT request error:', error);
    return handleDBError(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

// DELETE - Delete expense or recurring expense
export async function DELETE(request) {
  let conn;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // 'expense' or 'recurring'

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get database connection
    conn = await getDBConnection();

    if (type === 'recurring') {
      // Check if record exists
      const [existing] = await conn.query(
        'SELECT id FROM recurring_expenses WHERE id = ?', 
        [id]
      );

      if (existing.length === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      await conn.execute('DELETE FROM recurring_expenses WHERE id = ?', [id]);
    } else {
      // Get the receipt path before deleting to remove the file
      const [expense] = await conn.query(
        'SELECT receipt_attachment FROM expenses WHERE id = ?', 
        [id]
      );

      if (expense.length === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      await conn.execute('DELETE FROM expenses WHERE id = ?', [id]);

      // Remove the receipt file if it exists
      if (expense[0] && expense[0].receipt_attachment) {
        try {
          const filePath = path.join(process.cwd(), 'public', expense[0].receipt_attachment);
          await fs.unlink(filePath);
        } catch (fileError) {
          console.warn('Could not delete receipt file:', fileError);
        }
      }
    }

    return NextResponse.json({ message: 'Deleted successfully' });

  } catch (error) {
    console.error('DELETE request error:', error);
    return handleDBError(error);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}