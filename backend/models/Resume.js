const { pool } = require("../config/db");

const createResume = async ({
  userId,
  originalName,
  fileName,
  filePath,
  fileType,
  fileSize,
  extractedText
}) => {
  const query = `
    INSERT INTO resumes (
      user_id,
      original_name,
      file_name,
      file_path,
      file_type,
      file_size,
      extracted_text
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      user_id,
      original_name,
      file_name,
      file_path,
      file_type,
      file_size,
      extracted_text,
      created_at
  `;

  const values = [
    userId,
    originalName,
    fileName,
    filePath,
    fileType,
    fileSize,
    extractedText
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getResumesByUserId = async (userId) => {
  const query = `
    SELECT
      id,
      user_id,
      original_name,
      file_name,
      file_path,
      file_type,
      file_size,
      extracted_text,
      created_at
    FROM resumes
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

const getResumeById = async (resumeId, userId) => {
  const query = `
    SELECT
      id,
      user_id,
      original_name,
      file_name,
      file_path,
      file_type,
      file_size,
      extracted_text,
      created_at
    FROM resumes
    WHERE id = $1 AND user_id = $2
  `;

  const result = await pool.query(query, [resumeId, userId]);

  return result.rows[0];
};

const saveResumeAnalysis = async ({
  resumeId,
  overallScore,
  wordCount,
  skillCount,
  skills,
  sectionScore,
  skillScore,
  lengthScore,
  sections,
  recommendations
}) => {
  const query = `
    INSERT INTO resume_analyses (
      resume_id,
      overall_score,
      word_count,
      skill_count,
      skills,
      section_score,
      skill_score,
      length_score,
      sections,
      recommendations
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (resume_id)
    DO UPDATE SET
      overall_score = EXCLUDED.overall_score,
      word_count = EXCLUDED.word_count,
      skill_count = EXCLUDED.skill_count,
      skills = EXCLUDED.skills,
      section_score = EXCLUDED.section_score,
      skill_score = EXCLUDED.skill_score,
      length_score = EXCLUDED.length_score,
      sections = EXCLUDED.sections,
      recommendations = EXCLUDED.recommendations,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const values = [
    resumeId,
    overallScore,
    wordCount,
    skillCount,
    skills,
    sectionScore,
    skillScore,
    lengthScore,
    JSON.stringify(sections),
    recommendations
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getResumeAnalysis = async (resumeId) => {
  const query = `
    SELECT *
    FROM resume_analyses
    WHERE resume_id = $1
  `;

  const result = await pool.query(query, [resumeId]);

  return result.rows[0];
};

const getAnalysisHistoryByUserId = async (userId) => {
  const query = `
    SELECT
      r.id AS resume_id,
      r.original_name,
      r.created_at AS resume_created_at,
      a.id AS analysis_id,
      a.overall_score,
      a.word_count,
      a.skill_count,
      a.skills,
      a.section_score,
      a.skill_score,
      a.length_score,
      a.sections,
      a.recommendations,
      a.created_at AS analysis_created_at,
      a.updated_at AS analysis_updated_at
    FROM resumes r
    INNER JOIN resume_analyses a
      ON r.id = a.resume_id
    WHERE r.user_id = $1
    ORDER BY a.updated_at DESC
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

const deleteResume = async (resumeId, userId) => {
  const query = `
    DELETE FROM resumes
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [resumeId, userId]);

  return result.rows[0];
};

module.exports = {
  createResume,
  getResumesByUserId,
  getResumeById,
  saveResumeAnalysis,
  getResumeAnalysis,
  getAnalysisHistoryByUserId,
  deleteResume
};