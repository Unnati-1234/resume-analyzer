<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require('fs')
const path = require('path')

dotenv.config();

const { pool, connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const { checkHealth } = require("./controllers/healthController");

const errorMiddleware = require("./middleware/errorMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");

const app = express();

const uploadsPath = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

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
=======
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
  });

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

// ✅ Analysis Schema
const analysisSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  fileName: String,
  score: Number,
  matchedSkills: [String],
  missingSkills: [String],
  createdAt: { type: Date, default: Date.now },
});
const Analysis = mongoose.model("Analysis", analysisSchema);

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ message: "Registered successfully ✅", token, name: user.name });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ message: "Login successful ✅", token, name: user.name });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ✅ Upload Resume (protected)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf"))
    cb(null, true);
  else cb(new Error("Only PDF files are allowed!"), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

app.post("/upload", verifyToken, (req, res) => {
  upload.single("resume")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const filePath = req.file.path;
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      return res.status(200).json({
        message: "Resume uploaded successfully ✅",
        fileName: req.file.originalname,
        pageCount: pdfData.numpages,
        text: pdfData.text,
      });
    } catch (error) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(500).json({ message: "PDF parsing failed: " + error.message });
    }
  });
});

// ✅ Save Analysis (protected)
app.post("/save-analysis", verifyToken, async (req, res) => {
  try {
    const { fileName, score, matchedSkills, missingSkills } = req.body;
    const analysis = new Analysis({ userId: req.userId, fileName, score, matchedSkills, missingSkills });
    await analysis.save();
    return res.status(200).json({ message: "Analysis saved ✅" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to save" });
  }
});

// ✅ Get History (protected)
app.get("/history", verifyToken, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json(analyses);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch history" });
  }
});

app.get("/", (req, res) => res.send("Backend Running ✅"));
app.listen(5000, () => console.log("✅ Server running on port 5000"));
>>>>>>> 17a8fe89d47d1f6cd28bf32ace5f4512339e408d
