import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Vercel-compatible MySQL Connection configuration
// Replace all hardcoded localhost/127.0.0.1 with environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL is often required for cloud MySQL providers (Aiven, DigitalOcean, etc.)
  ssl: {
    rejectUnauthorized: false
  }
});

// Wrapper to execute queries with standardized result formatting
export const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
  try {
    const [results] = await pool.execute(query, params);

    // Normalize results to handle both SELECT and DML (INSERT/UPDATE/DELETE) operations
    if (Array.isArray(results)) {
      return results;
    }

    const info = results as any;
    return {
      insertId: info.insertId,
      affectedRows: info.affectedRows
    };
  } catch (error: any) {
    console.error('❌ Database Query Error:', {
      message: error.message,
      code: error.code,
      query: query.substring(0, 50) + '...' // Log first 50 chars for context
    });
    throw error;
  }
};

// Test connection and setup the database
const setupDb = async () => {
  try {
    console.log(`🔌 Attempting to connect to database: ${process.env.DB_NAME} on ${process.env.DB_HOST}...`);
    
    // Testing the connection from the pool
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
  } catch (error: any) {
    console.error('❌ CRITICAL: Failed to connect to MySQL database.');
    console.error('Check your Vercel Environment Variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT');
    console.error('Technical Details:', {
      code: error.code, // e.g., ECONNREFUSED
      address: error.address,
      port: error.port
    });
    throw error;
  }
};

export default setupDb;

