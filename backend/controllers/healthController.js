const { pool } = require("../config/db");

const checkHealth = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS database_time"
    );

    res.status(200).json({
      success: true,
      server: "running",
      database: "connected",
      databaseTime: result.rows[0].database_time
    });
  } catch (error) {
    console.error("Health check error:", error.message);

    res.status(503).json({
      success: false,
      server: "running",
      database: "disconnected"
    });
  }
};

module.exports = {
  checkHealth
};