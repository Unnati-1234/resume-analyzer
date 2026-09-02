const fs = require("fs");

const {
  createResume,
  getResumesByUserId,
  getResumeById,
  saveResumeAnalysis,
  getResumeAnalysis,
  getAnalysisHistoryByUserId,
  deleteResume
} = require("../models/Resume");

const { parseResume } = require("../services/resumeParser");
const { analyzeResume } = require("../services/resumeAnalyzer");
const { matchResumeWithJob } = require("../services/jobMatcher");

// ============================================
// GET ALL USER RESUMES
// ============================================

const getUserResumes = async (req, res) => {
  try {
    const resumes = await getResumesByUserId(req.user.id);

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes
    });
  } catch (error) {
    console.error("Get resumes error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching resumes"
    });
  }
};

// ============================================
// GET SINGLE RESUME
// ============================================

const getSingleResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await getResumeById(
      id,
      req.user.id
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    res.status(200).json({
      success: true,
      resume
    });
  } catch (error) {
    console.error(
      "Get resume error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error while fetching resume"
    });
  }
};

// ============================================
// UPLOAD RESUME
// ============================================

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume"
      });
    }

    const extractedText = await parseResume(
      req.file.path,
      req.file.mimetype
    );

    if (
      !extractedText ||
      !extractedText.trim()
    ) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error(
          "Uploaded file cleanup error:",
          deleteError.message
        );
      }

      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from the resume"
      });
    }

    const resume = await createResume({
      userId: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      extractedText: extractedText.trim()
    });

    res.status(201).json({
      success: true,
      message:
        "Resume uploaded and parsed successfully",
      resume
    });
  } catch (error) {
    if (
      req.file &&
      req.file.path
    ) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error(
          "Uploaded file cleanup error:",
          deleteError.message
        );
      }
    }

    console.error(
      "Resume upload error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to upload or parse resume"
    });
  }
};

// ============================================
// ANALYZE RESUME
// ============================================

const analyzeUploadedResume = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const resume = await getResumeById(
      id,
      req.user.id
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    if (
      !resume.extracted_text ||
      !resume.extracted_text.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No extracted text available for this resume"
      });
    }

    // Run resume analysis
    const analysis = analyzeResume(
      resume.extracted_text
    );

    // Save complete analysis
    const savedAnalysis =
      await saveResumeAnalysis({
        resumeId: resume.id,

        // Existing scores
        overallScore:
          analysis.overallScore,

        wordCount:
          analysis.wordCount,

        skillCount:
          analysis.skillCount,

        skills:
          analysis.skills,

        sectionScore:
          analysis.sectionScore,

        skillScore:
          analysis.skillScore,

        lengthScore:
          analysis.lengthScore,

        sections:
          analysis.sections,

        recommendations:
          analysis.recommendations,

        // Detailed analysis
        contentScore:
          analysis.contentScore,

        detailedSectionScores:
          analysis.detailedSectionScores,

        strengths:
          analysis.strengths,

        weaknesses:
          analysis.weaknesses,

        contactInformation:
          analysis.contactInformation,

        actionVerbs:
          analysis.actionVerbs,

        quantifiableAchievements:
          analysis.quantifiableAchievements,

        // ATS compatibility
        atsCompatibility:
          analysis.atsCompatibility
      });

    res.status(200).json({
      success: true,
      message:
        "Resume analyzed successfully",
      resumeId: resume.id,
      analysis: savedAnalysis
    });
  } catch (error) {
    console.error(
      "Resume analysis error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to analyze resume"
    });
  }
};

// ============================================
// GET SAVED ANALYSIS
// ============================================

const getSavedAnalysis = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const resume = await getResumeById(
      id,
      req.user.id
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    const analysis =
      await getResumeAnalysis(id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message:
          "No analysis found for this resume"
      });
    }

    res.status(200).json({
      success: true,
      resumeId: resume.id,
      analysis
    });
  } catch (error) {
    console.error(
      "Get analysis error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch resume analysis"
    });
  }
};

// ============================================
// GET ANALYSIS HISTORY
// ============================================

const getAnalysisHistory = async (
  req,
  res
) => {
  try {
    const history =
      await getAnalysisHistoryByUserId(
        req.user.id
      );

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error(
      "Get analysis history error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch analysis history"
    });
  }
};

// ============================================
// MATCH RESUME WITH JOB
// ============================================

const matchResumeToJob = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      jobDescription
    } = req.body;

    if (
      !jobDescription ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Job description is required"
      });
    }

    const resume =
      await getResumeById(
        id,
        req.user.id
      );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    if (
      !resume.extracted_text ||
      !resume.extracted_text.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No extracted text available for this resume"
      });
    }

    const result =
      matchResumeWithJob(
        resume.extracted_text,
        jobDescription
      );

    res.status(200).json({
      success: true,
      message:
        "Resume matched with job description successfully",
      resumeId: resume.id,
      result
    });
  } catch (error) {
    console.error(
      "Job matching error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to match resume with job description"
    });
  }
};

// ============================================
// DOWNLOAD RESUME
// ============================================

const downloadResume = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const resume =
      await getResumeById(
        id,
        req.user.id
      );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    if (
      !fs.existsSync(
        resume.file_path
      )
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Resume file not found"
      });
    }

    res.download(
      resume.file_path,
      resume.original_name,
      (error) => {
        if (
          error &&
          !res.headersSent
        ) {
          console.error(
            "Resume download error:",
            error.message
          );

          res.status(500).json({
            success: false,
            message:
              "Failed to download resume"
          });
        }
      }
    );
  } catch (error) {
    console.error(
      "Resume download error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while downloading resume"
    });
  }
};

// ============================================
// DELETE RESUME
// ============================================

const removeResume = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const resume =
      await deleteResume(
        id,
        req.user.id
      );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    // Delete physical file
    if (resume.file_path) {
      try {
        fs.unlinkSync(
          resume.file_path
        );
      } catch (error) {
        console.error(
          "Resume file deletion error:",
          error.message
        );
      }
    }

    res.status(200).json({
      success: true,
      message:
        "Resume deleted successfully"
    });
  } catch (error) {
    console.error(
      "Delete resume error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while deleting resume"
    });
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  getUserResumes,
  getSingleResume,
  uploadResume,
  analyzeUploadedResume,
  getSavedAnalysis,
  getAnalysisHistory,
  matchResumeToJob,
  downloadResume,
  removeResume
};