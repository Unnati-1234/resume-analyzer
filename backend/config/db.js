const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const connectDB = async () => {
  try {
    const client = await pool.connect();

    console.log("PostgreSQL connected successfully");

    client.release();
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB
};