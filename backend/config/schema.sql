-- ============================================
-- RESUME ANALYZER DATABASE SCHEMA
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- RESUMES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    extracted_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resume_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- Make sure extracted_text exists
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS extracted_text TEXT;


-- ============================================
-- RESUME ANALYSES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS resume_analyses (
    id SERIAL PRIMARY KEY,

    resume_id INTEGER NOT NULL UNIQUE,

    -- Basic analysis
    overall_score INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    skill_count INTEGER NOT NULL,
    skills TEXT[],

    -- Score breakdown
    section_score INTEGER NOT NULL,
    skill_score INTEGER NOT NULL,
    length_score INTEGER NOT NULL,

    -- Existing analysis data
    sections JSONB NOT NULL,
    recommendations TEXT[],

    -- ========================================
    -- Detailed Analysis
    -- ========================================

    content_score INTEGER DEFAULT 0,

    detailed_section_scores JSONB
        DEFAULT '{}'::jsonb,

    strengths TEXT[]
        DEFAULT '{}',

    weaknesses TEXT[]
        DEFAULT '{}',

    contact_information JSONB
        DEFAULT '{}'::jsonb,

    action_verbs TEXT[]
        DEFAULT '{}',

    quantifiable_achievements JSONB
        DEFAULT '{}'::jsonb,

    -- ========================================
    -- Timestamps
    -- ========================================

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    -- ========================================
    -- Foreign Key
    -- ========================================

    CONSTRAINT fk_analysis_resume
        FOREIGN KEY (resume_id)
        REFERENCES resumes(id)
        ON DELETE CASCADE
);


-- ============================================
-- EXISTING DATABASE MIGRATION
-- ============================================
-- These ensure the new columns are also added
-- if resume_analyses already existed before
-- the new features were introduced.
-- ============================================

ALTER TABLE resume_analyses
ADD COLUMN IF NOT EXISTS content_score INTEGER DEFAULT 0;

ALTER TABLE resume_analyses
ADD COLUMN IF NOT EXISTS detailed_section_scores JSONB
DEFAULT '{}'::jsonb;

ALTER TABLE resume_analyses
ADD COLUMN IF NOT EXISTS strengths TEXT[]
DEFAULT '{}';

ALTER TABLE resume_analyses
ADD COLUMN IF NOT EXISTS weaknesses TEXT[]
DEFAULT '{}';

ALTER TABLE resume_analyses
ADD COLUMN IF NOT EXISTS contact_information JSONB
DEFAULT '{}'::jsonb;

ALTER TABLE resume_analyses
ADD COLUMN IF NOT EXISTS action_verbs TEXT[]
DEFAULT '{}';

ALTER TABLE resume_analyses
ADD COLUMN IF NOT EXISTS quantifiable_achievements JSONB
DEFAULT '{}'::jsonb;