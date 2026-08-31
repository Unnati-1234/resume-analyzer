const express = require("express");

const {
  getUserResumes,
  getSingleResume,
  uploadResume,
  analyzeUploadedResume,
  getSavedAnalysis,
  getAnalysisHistory,
  matchResumeToJob,
  downloadResume,
  removeResume
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/",
  authMiddleware,
  getUserResumes
);

router.get(
  "/history",
  authMiddleware,
  getAnalysisHistory
);

router.post(
  "/:id/analyze",
  authMiddleware,
  analyzeUploadedResume
);

router.get(
  "/:id/analysis",
  authMiddleware,
  getSavedAnalysis
);

router.post(
  "/:id/match-job",
  authMiddleware,
  matchResumeToJob
);

router.get(
  "/:id/download",
  authMiddleware,
  downloadResume
);

router.get(
  "/:id",
  authMiddleware,
  getSingleResume
);

router.delete(
  "/:id",
  authMiddleware,
  removeResume
);

module.exports = router;