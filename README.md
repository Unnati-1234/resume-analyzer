# 📄 Resume Analyzer

A full-stack web application that helps users analyze and improve their resumes through resume scoring, ATS-style analysis, personalized recommendations, and job-description matching.

🌐 **Live Demo:** https://resume-analyzer-2-c9vj.onrender.com

💻 **GitHub:** https://github.com/Unnati-1234/resume-analyzer

---

## ✨ Features

- 🔐 User registration and login
- 📄 Upload PDF and DOCX resumes
- 📊 Resume scoring and detailed analysis
- 🎯 ATS compatibility analysis
- 💡 Personalized strengths, weaknesses and recommendations
- 🔎 Resume-to-job-description matching
- 📋 Matching and missing skill identification
- 📜 Resume analysis history
- ⬇️ Resume download and deletion
- 🔒 Protected user-specific APIs

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript / JSX
- React Context API

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- PostgreSQL
- Neon

### Authentication & File Processing
- JWT
- bcrypt
- Multer
- pdf-parse
- Mammoth

### Deployment
- Render
- Neon PostgreSQL

---

## 🏗️ Architecture

```text
React + Vite + Tailwind CSS
            │
            ▼
       REST APIs
            │
            ▼
    Node.js + Express.js
            │
      ┌─────┴─────┐
      ▼           ▼
 Resume Parser   PostgreSQL
      │           │
      ▼           ▼
Resume Analysis  Neon
      │
      ▼
 Job Matching