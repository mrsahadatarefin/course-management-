import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  saltRounds: process.env.saltRounds,
  jwt_access_secret: process.env.jwt_access_secret,
  jwt_access_expires_in: process.env.jwt_access_expires_in,
};
