import { Pool } from "pg";

const pool = new Pool({
  connectionString: `postgres://${process.env.EXPO_PUBLIC_DB_USERNAME}:${process.env.EXPO_PUBLIC_DB_PASSWORD}@us-west-2.db.thenile.dev:5432/CampuSphere`,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
