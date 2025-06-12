import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ,
});

const db = {
  query: (text: string, params?: any[]): Promise<QueryResult> => {
    return pool.query(text, params);
  },
  pool,
};

export default db; 
