const dotenv = require("dotenv");

dotenv.config();

const { pool } = require("./config/db");

const migrate = async () => {
  try {
    console.log("Running database migration...");

    await pool.query(`
      ALTER TABLE resume_analyses
      ADD COLUMN IF NOT EXISTS ats_compatibility JSONB
      DEFAULT '{}'::jsonb;
    `);

    console.log("Database migration completed successfully.");
  } catch (error) {
    console.error("Database migration failed:", error.message);
  } finally {
    await pool.end();
  }
};

migrate();