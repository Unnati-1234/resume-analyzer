const SECTION_PATTERNS = {
  summary: [
    "summary",
    "professional summary",
    "profile",
    "objective",
    "career objective"
  ],
  skills: [
    "skills",
    "technical skills",
    "core skills",
    "key skills",
    "technologies"
  ],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment"
  ],
  education: [
    "education",
    "academic background",
    "academic qualifications"
  ],
  projects: [
    "projects",
    "personal projects",
    "academic projects",
    "project experience"
  ],
  certifications: [
    "certifications",
    "certificates",
    "licenses"
  ]
};

const SKILLS = [
  "javascript",
  "typescript",
  "react",
  "react.js",
  "node.js",
  "nodejs",
  "express",
  "express.js",
  "mongodb",
  "postgresql",
  "mysql",
  "python",
  "java",
  "c++",
  "c",
  "html",
  "css",
  "tailwind",
  "tailwind css",
  "bootstrap",
  "git",
  "github",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "sql",
  "rest api",
  "rest",
  "next.js",
  "angular",
  "vue",
  "machine learning",
  "data analysis",
  "pandas",
  "numpy",
  "tensorflow",
  "pytorch"
];

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
};

const findSections = (text) => {
  const normalizedText = normalizeText(text);
  const sections = {};

  Object.entries(SECTION_PATTERNS).forEach(([section, patterns]) => {
    sections[section] = patterns.some((pattern) => {
      const escapedPattern = pattern.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(`\\b${escapedPattern}\\b`, "i");

      return regex.test(normalizedText);
    });
  });

  return sections;
};

const findSkills = (text) => {
  const normalizedText = normalizeText(text);
  const foundSkills = [];

  SKILLS.forEach((skill) => {
    const escapedSkill = skill.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");

    if (regex.test(normalizedText)) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)];
};

const calculateWordCount = (text) => {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.length;
};

const calculateSectionScore = (sections) => {
  const sectionValues = Object.values(sections);
  const availableSections = sectionValues.filter(Boolean).length;

  return Math.round(
    (availableSections / sectionValues.length) * 100
  );
};

const calculateSkillScore = (skills) => {
  const targetSkillCount = 10;

  return Math.min(
    100,
    Math.round((skills.length / targetSkillCount) * 100)
  );
};

const calculateLengthScore = (wordCount) => {
  if (wordCount >= 300 && wordCount <= 1000) {
    return 100;
  }

  if (wordCount >= 200 && wordCount < 300) {
    return 80;
  }

  if (wordCount > 1000 && wordCount <= 1500) {
    return 80;
  }

  if (wordCount >= 100 && wordCount < 200) {
    return 60;
  }

  return 40;
};

const calculateOverallScore = ({
  sectionScore,
  skillScore,
  lengthScore
}) => {
  return Math.round(
    sectionScore * 0.4 +
    skillScore * 0.4 +
    lengthScore * 0.2
  );
};

const generateRecommendations = ({
  sections,
  skills,
  wordCount
}) => {
  const recommendations = [];

  if (!sections.summary) {
    recommendations.push(
      "Add a professional summary or career objective."
    );
  }

  if (!sections.skills) {
    recommendations.push(
      "Add a dedicated skills section."
    );
  }

  if (!sections.experience) {
    recommendations.push(
      "Add work experience or relevant internship experience."
    );
  }

  if (!sections.education) {
    recommendations.push(
      "Add your educational qualifications."
    );
  }

  if (!sections.projects) {
    recommendations.push(
      "Add relevant projects that demonstrate your technical skills."
    );
  }

  if (skills.length < 5) {
    recommendations.push(
      "Add more relevant technical skills and technologies."
    );
  }

  if (wordCount < 200) {
    recommendations.push(
      "Your resume appears too short. Add more relevant details about your experience and projects."
    );
  }

  if (wordCount > 1500) {
    recommendations.push(
      "Your resume may be too long. Remove unnecessary or repetitive information."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your resume has a good basic structure. Focus on improving measurable achievements and job-specific keywords."
    );
  }

  return recommendations;
};

const analyzeResume = (text) => {
  if (!text || !text.trim()) {
    throw new Error("Resume text is empty");
  }

  const wordCount = calculateWordCount(text);
  const sections = findSections(text);
  const skills = findSkills(text);

  const sectionScore = calculateSectionScore(sections);
  const skillScore = calculateSkillScore(skills);
  const lengthScore = calculateLengthScore(wordCount);

  const overallScore = calculateOverallScore({
    sectionScore,
    skillScore,
    lengthScore
  });

  const recommendations = generateRecommendations({
    sections,
    skills,
    wordCount
  });

  return {
    overallScore,
    wordCount,
    skills,
    skillCount: skills.length,
    sections,
    sectionScore,
    skillScore,
    lengthScore,
    recommendations
  };
};

module.exports = {
  analyzeResume
};