import { createPool } from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config();
export const connection = createPool({
  // prefer to use .env for environment variables to hide passwords
  host: process.env.STACKHERO_MYSQL_HOST,
  user: 'root',
  password: process.env.STACKHERO_MYSQL_ROOT_PASSWORD,
  database: process.env.DATABASE_NAME
});