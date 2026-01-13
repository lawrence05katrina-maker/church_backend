const { Pool } = require("pg");
require("dotenv").config();

// Local-first database configuration
// Prioritizes individual variables (for local development) over DATABASE_URL (for cloud deployment)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Fallback to DATABASE_URL for cloud deployment
  connectionString: process.env.DB_USER ? undefined : process.env.DATABASE_URL,
  // SSL configuration only for cloud databases
  ssl: process.env.DATABASE_URL && !process.env.DB_USER ? 
    { rejectUnauthorized: false } : false
});

pool.on("connect", () => {
  const dbSource = process.env.DB_USER ? "Local Database" : "Cloud Database";
  console.log(`✅ PostgreSQL connected successfully to ${dbSource}`);
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err);
});

module.exports = pool;