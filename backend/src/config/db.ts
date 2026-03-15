import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lms_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
  try {
    const [results] = await pool.execute(query, params);

    // Normalize results to match the previous sync sqlite Return structure
    // SELECT -> array of objects
    // INSERT -> { insertId, affectedRows }
    // UPDATE/DELETE -> { affectedRows }

    if (Array.isArray(results)) {
      return results;
    }

    const info = results as any;
    return {
      insertId: info.insertId,
      affectedRows: info.affectedRows
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};

const setupDb = async () => {
  try {
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error);
    throw error;
  }
};

export default setupDb;

