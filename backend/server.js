const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { pool, connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const { checkHealth } = require("./controllers/healthController");

const errorMiddleware = require("./middleware/errorMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "Resume Analyser API is running",
      database: "PostgreSQL connected",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error("Database query error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database query failed"
    });
  }
});

app.get("/api/health", checkHealth);

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();