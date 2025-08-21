export interface LambdaResponse<T = any> {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  rowCount?: number;
  meta?: {
    affectedRows?: number;
    insertId?: number;
    warningCount?: number;
    info?: string;
  };
  sqlState?: string;
  errno?: number;
}

export class LambdaClient {
  private lambdaUrl: string;

  constructor() {
    this.lambdaUrl = process.env.LAMBDA_FUNCTION_URL || '';
    if (!this.lambdaUrl) {
      throw new Error('LAMBDA_FUNCTION_URL environment variable not set');
    }
  }

  private async makeRequest(payload: any): Promise<ApiResponse> {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };

    console.log(`Making request to Lambda:`, this.lambdaUrl);
    console.log('Request payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(this.lambdaUrl, requestOptions);

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log('Raw response status:', response.status);
    console.log('Raw response body:', responseText);

    if (!response.ok) {
      throw new Error(`Lambda request failed: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
    }

    // Try to parse as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error(`Invalid JSON response from Lambda: ${responseText.substring(0, 200)}...`);
    }

    // Handle Lambda Function URL format
    if (parsedResponse.statusCode !== undefined) {
      try {
        const data = JSON.parse(parsedResponse.body);
        console.log('Parsed Lambda response:', data);
        return data;
      } catch (bodyParseError) {
        console.error('Failed to parse Lambda body:', bodyParseError);
        throw new Error(`Invalid JSON in Lambda response body: ${parsedResponse.body}`);
      }
    } else {
      // Direct response format
      console.log('Direct response:', parsedResponse);
      return parsedResponse;
    }
  }

  // Execute any SQL query directly
  async executeQuery(sql: string, params: any[] = [], queryType?: 'select' | 'insert' | 'update' | 'delete'): Promise<ApiResponse> {
    return this.makeRequest({
      operation: 'query',
      query: sql,
      params,
      queryType: queryType || (sql.trim().toLowerCase().startsWith('select') ? 'select' : 'modify')
    });
  }

  // Convenience method for SELECT queries
  async select(sql: string, params: any[] = []): Promise<ApiResponse> {
    return this.executeQuery(sql, params, 'select');
  }

  // Convenience method for INSERT queries
  async insert(sql: string, params: any[] = []): Promise<ApiResponse> {
    return this.executeQuery(sql, params, 'insert');
  }

  // Convenience method for UPDATE queries
  async update(sql: string, params: any[] = []): Promise<ApiResponse> {
    return this.executeQuery(sql, params, 'update');
  }

  // Convenience method for DELETE queries
  async delete(sql: string, params: any[] = []): Promise<ApiResponse> {
    return this.executeQuery(sql, params, 'delete');
  }

  // Test connection method
  async testConnection(): Promise<ApiResponse> {
    try {
      console.log('Testing Lambda connection...');
      const response = await this.select('SELECT 1 as test_connection');
      console.log('Connection test successful:', response);
      return response;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.select('SELECT NOW() as server_time, VERSION() as mysql_version');
  }
}

// Create singleton instance
export const lambdaClient = new LambdaClient();