const { Pool } = require("pg");
require("dotenv").config();

// Cloud-first database configuration
// Prioritizes DATABASE_URL (for production/cloud) over individual variables (for local development)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  // Fallback to individual variables for local development
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,
  // SSL configuration for cloud databases
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL ? 
    { rejectUnauthorized: false } : false
});

pool.on("connect", () => {
  const dbSource = process.env.DATABASE_URL ? "Cloud Database" : "Local Database";
  console.log(`✅ PostgreSQL connected successfully to ${dbSource}`);
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err);
});

module.exports = pool;
