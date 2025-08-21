// lib/dbAdapter.ts - Adapter to minimize changes when migrating from direct DB to Lambda
import { lambdaClient } from './lambdaClient';

// Mock the mysql2 connection interface for compatibility
export interface DatabaseConnection {
  query(sql: string, params?: any[]): Promise<[any[], any]>;
  execute(sql: string, params?: any[]): Promise<[any, any]>;
  end(): Promise<void>;
}

// Adapter class that mimics mysql2 connection behavior
class LambdaConnectionAdapter implements DatabaseConnection {
  async query(sql: string, params: any[] = []): Promise<[any[], any]> {
    try {
      const result = await lambdaClient.executeQuery(sql, params);
      
      if (!result.success) {
        throw new Error(result.error || 'Query failed');
      }

      // Return in mysql2 format: [rows, fields]
      return [result.data || [], {}];
    } catch (error) {
      console.error('Lambda query error:', error);
      throw error;
    }
  }

  async execute(sql: string, params: any[] = []): Promise<[any, any]> {
    try {
      const result = await lambdaClient.executeQuery(sql, params);
      
      if (!result.success) {
        throw new Error(result.error || 'Execute failed');
      }

      // For non-SELECT queries, return execution result
      const execResult = {
        affectedRows: result.meta?.affectedRows || 0,
        insertId: result.meta?.insertId || 0,
        warningCount: result.meta?.warningCount || 0,
        info: result.meta?.info || null
      };

      return [execResult, {}];
    } catch (error) {
      console.error('Lambda execute error:', error);
      throw error;
    }
  }

  async end(): Promise<void> {
    // No-op since Lambda handles connection management
    return Promise.resolve();
  }
}

// Factory function that returns the adapter
export async function getDBConnection(): Promise<DatabaseConnection> {
  return new LambdaConnectionAdapter();
}

// Alternative: Direct replacement function for existing code
export async function getPool(): Promise<DatabaseConnection> {
  return new LambdaConnectionAdapter();
}