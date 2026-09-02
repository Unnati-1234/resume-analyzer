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
    "employment",
    "internship"
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

const ACTION_VERBS = [
  "developed",
  "designed",
  "implemented",
  "created",
  "built",
  "managed",
  "led",
  "optimized",
  "improved",
  "automated",
  "integrated",
  "deployed",
  "engineered",
  "configured",
  "tested",
  "debugged",
  "maintained",
  "analyzed",
  "achieved",
  "delivered",
  "launched",
  "coordinated",
  "programmed",
  "architected"
];

/* ============================================
   NORMALIZATION
============================================ */

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/* ============================================
   SECTION DETECTION
============================================ */

const findSections = (text) => {
  const normalizedText = normalizeText(text);
  const sections = {};

  Object.entries(SECTION_PATTERNS).forEach(
    ([section, patterns]) => {
      sections[section] = patterns.some((pattern) => {
        const escapedPattern = escapeRegex(pattern);

        const regex = new RegExp(
          `\\b${escapedPattern}\\b`,
          "i"
        );

        return regex.test(normalizedText);
      });
    }
  );

  return sections;
};

/* ============================================
   SKILL DETECTION
============================================ */

const findSkills = (text) => {
  const normalizedText = normalizeText(text);
  const foundSkills = [];

  SKILLS.forEach((skill) => {
    const escapedSkill = escapeRegex(skill);

    const regex = new RegExp(
      `\\b${escapedSkill}\\b`,
      "i"
    );

    if (regex.test(normalizedText)) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)];
};

/* ============================================
   WORD COUNT
============================================ */

const calculateWordCount = (text) => {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.length;
};

/* ============================================
   SECTION SCORE
============================================ */

const calculateSectionScore = (sections) => {
  const sectionValues = Object.values(sections);

  const availableSections =
    sectionValues.filter(Boolean).length;

  return Math.round(
    (availableSections / sectionValues.length) * 100
  );
};

/* ============================================
   SKILL SCORE
============================================ */

const calculateSkillScore = (skills) => {
  const targetSkillCount = 10;

  return Math.min(
    100,
    Math.round(
      (skills.length / targetSkillCount) * 100
    )
  );
};

/* ============================================
   LENGTH SCORE
============================================ */

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

/* ============================================
   ACTION VERBS
============================================ */

const findActionVerbs = (text) => {
  const normalizedText = normalizeText(text);
  const foundVerbs = [];

  ACTION_VERBS.forEach((verb) => {
    const regex = new RegExp(
      `\\b${escapeRegex(verb)}\\b`,
      "i"
    );

    if (regex.test(normalizedText)) {
      foundVerbs.push(verb);
    }
  });

  return [...new Set(foundVerbs)];
};

/* ============================================
   QUANTIFIABLE ACHIEVEMENTS
============================================ */

const findQuantifiableAchievements = (text) => {
  const matches = [];

  const percentagePattern =
    /\b\d+(?:\.\d+)?%/g;

  const numberPattern =
    /\b\d+(?:\.\d+)?\b/g;

  const percentages =
    text.match(percentagePattern) || [];

  const numbers =
    text.match(numberPattern) || [];

  matches.push(...percentages);

  numbers.forEach((number) => {
    if (!matches.includes(number)) {
      matches.push(number);
    }
  });

  return {
    total: matches.length,
    values: [...new Set(matches)].slice(0, 20)
  };
};

/* ============================================
   CONTACT INFORMATION
============================================ */

const extractContactInformation = (text) => {
  const emailMatch = text.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );

  const phoneMatch = text.match(
    /(?:\+?\d{1,3}[\s.-]?)?(?:\d{3}[\s.-]?)?\d{3}[\s.-]?\d{4}/
  );

  const linkedinMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s)]+/i
  );

  const githubMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s)]+/i
  );

  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    linkedin: linkedinMatch ? linkedinMatch[0] : null,
    github: githubMatch ? githubMatch[0] : null
  };
};

/* ============================================
   CONTENT SCORE
============================================ */

const calculateContentScore = ({
  text,
  wordCount,
  actionVerbs,
  quantifiableAchievements
}) => {
  let score = 0;

  const normalizedText = normalizeText(text);

  if (wordCount >= 300) {
    score += 25;
  } else if (wordCount >= 200) {
    score += 20;
  } else if (wordCount >= 100) {
    score += 10;
  }

  if (actionVerbs.length >= 8) {
    score += 30;
  } else if (actionVerbs.length >= 5) {
    score += 25;
  } else if (actionVerbs.length >= 3) {
    score += 15;
  } else if (actionVerbs.length >= 1) {
    score += 10;
  }

  if (quantifiableAchievements.total >= 5) {
    score += 30;
  } else if (quantifiableAchievements.total >= 3) {
    score += 25;
  } else if (quantifiableAchievements.total >= 1) {
    score += 15;
  }

  const words = normalizedText
    .split(/\s+/)
    .filter(Boolean);

  const uniqueWords = new Set(words);

  if (
    words.length > 0 &&
    uniqueWords.size / words.length >= 0.5
  ) {
    score += 15;
  }

  return Math.min(100, score);
};

/* ============================================
   DETAILED SECTION SCORES
============================================ */

const calculateDetailedSectionScores = ({
  sections,
  skills,
  actionVerbs,
  quantifiableAchievements
}) => {
  const scores = {};

  scores.summary = sections.summary ? 100 : 0;

  scores.skills = calculateSkillScore(skills);

  if (sections.experience) {
    let experienceScore = 60;

    if (actionVerbs.length >= 3) {
      experienceScore += 20;
    }

    if (quantifiableAchievements.total >= 1) {
      experienceScore += 20;
    }

    scores.experience = Math.min(
      100,
      experienceScore
    );
  } else {
    scores.experience = 0;
  }

  scores.education =
    sections.education ? 100 : 0;

  scores.projects =
    sections.projects ? 100 : 0;

  scores.certifications =
    sections.certifications ? 100 : 0;

  return scores;
};

/* ============================================
   STRENGTHS
============================================ */

const generateStrengths = ({
  sections,
  skills,
  wordCount,
  actionVerbs,
  quantifiableAchievements
}) => {
  const strengths = [];

  if (skills.length >= 5) {
    strengths.push(
      `Good technical skill coverage with ${skills.length} detected skills.`
    );
  }

  if (sections.projects) {
    strengths.push(
      "Projects section is present and demonstrates practical experience."
    );
  }

  if (sections.experience) {
    strengths.push(
      "Experience section is included."
    );
  }

  if (sections.education) {
    strengths.push(
      "Education section is clearly included."
    );
  }

  if (actionVerbs.length >= 5) {
    strengths.push(
      "Uses strong action-oriented language."
    );
  }

  if (quantifiableAchievements.total >= 3) {
    strengths.push(
      "Contains measurable achievements or numerical results."
    );
  }

  if (wordCount >= 300 && wordCount <= 1000) {
    strengths.push(
      "Resume length is within a generally appropriate range."
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "Resume contains basic information that can be further improved."
    );
  }

  return strengths;
};

/* ============================================
   WEAKNESSES
============================================ */

const generateWeaknesses = ({
  sections,
  skills,
  wordCount,
  actionVerbs,
  quantifiableAchievements
}) => {
  const weaknesses = [];

  if (!sections.summary) {
    weaknesses.push(
      "Professional summary or career objective is missing."
    );
  }

  if (!sections.skills) {
    weaknesses.push(
      "Dedicated skills section is missing."
    );
  }

  if (!sections.experience) {
    weaknesses.push(
      "Work experience or internship section is missing."
    );
  }

  if (!sections.projects) {
    weaknesses.push(
      "Projects section is missing."
    );
  }

  if (!sections.education) {
    weaknesses.push(
      "Education section is missing."
    );
  }

  if (skills.length < 5) {
    weaknesses.push(
      "Limited number of recognizable technical skills detected."
    );
  }

  if (actionVerbs.length < 3) {
    weaknesses.push(
      "Resume uses relatively few strong action verbs."
    );
  }

  if (quantifiableAchievements.total === 0) {
    weaknesses.push(
      "No obvious numerical or measurable achievements detected."
    );
  }

  if (wordCount < 200) {
    weaknesses.push(
      "Resume content appears too short."
    );
  }

  if (wordCount > 1500) {
    weaknesses.push(
      "Resume may contain unnecessary or repetitive content."
    );
  }

  return weaknesses;
};

/* ============================================
   ATS COMPATIBILITY SCORE
============================================ */

const calculateATSScore = ({
  sections,
  skills,
  contactInformation,
  actionVerbs,
  quantifiableAchievements,
  wordCount
}) => {
  let score = 0;

  const atsChecks = [];

  /*
    1. Important resume sections
  */

  const importantSections = [
    sections.summary,
    sections.skills,
    sections.experience,
    sections.education,
    sections.projects
  ];

  const sectionCount =
    importantSections.filter(Boolean).length;

  const sectionPoints =
    Math.round((sectionCount / 5) * 30);

  score += sectionPoints;

  atsChecks.push({
    name: "Standard resume sections",
    passed: sectionCount >= 4,
    score: sectionPoints
  });

  /*
    2. Technical keywords
  */

  const skillPoints = Math.min(
    25,
    Math.round((skills.length / 10) * 25)
  );

  score += skillPoints;

  atsChecks.push({
    name: "Relevant technical keywords",
    passed: skills.length >= 5,
    score: skillPoints
  });

  /*
    3. Contact information
  */

  let contactScore = 0;

  if (contactInformation.email) {
    contactScore += 5;
  }

  if (contactInformation.phone) {
    contactScore += 5;
  }

  if (contactInformation.linkedin) {
    contactScore += 2.5;
  }

  if (contactInformation.github) {
    contactScore += 2.5;
  }

  score += contactScore;

  atsChecks.push({
    name: "Contact information",
    passed:
      Boolean(contactInformation.email) &&
      Boolean(contactInformation.phone),
    score: contactScore
  });

  /*
    4. Action verbs
  */

  const actionVerbPoints = Math.min(
    15,
    Math.round(
      (actionVerbs.length / 6) * 15
    )
  );

  score += actionVerbPoints;

  atsChecks.push({
    name: "Action-oriented language",
    passed: actionVerbs.length >= 3,
    score: actionVerbPoints
  });

  /*
    5. Quantifiable achievements
  */

  let achievementPoints = 0;

  if (quantifiableAchievements.total >= 5) {
    achievementPoints = 10;
  } else if (
    quantifiableAchievements.total >= 3
  ) {
    achievementPoints = 7;
  } else if (
    quantifiableAchievements.total >= 1
  ) {
    achievementPoints = 4;
  }

  score += achievementPoints;

  atsChecks.push({
    name: "Quantifiable achievements",
    passed:
      quantifiableAchievements.total >= 3,
    score: achievementPoints
  });

  /*
    6. Resume length
  */

  let lengthPoints = 0;

  if (wordCount >= 300 && wordCount <= 1000) {
    lengthPoints = 10;
  } else if (
    wordCount >= 200 &&
    wordCount <= 1500
  ) {
    lengthPoints = 7;
  } else {
    lengthPoints = 3;
  }

  score += lengthPoints;

  atsChecks.push({
    name: "Resume length",
    passed:
      wordCount >= 300 &&
      wordCount <= 1000,
    score: lengthPoints
  });

  return {
    score: Math.min(100, Math.round(score)),
    checks: atsChecks
  };
};

/* ============================================
   RECOMMENDATIONS
============================================ */

const generateRecommendations = ({
  sections,
  skills,
  wordCount,
  actionVerbs,
  quantifiableAchievements,
  contactInformation,
  atsCompatibility
}) => {
  const recommendations = [];

  if (!sections.summary) {
    recommendations.push(
      "Add a professional summary that briefly highlights your experience, skills, and career goals."
    );
  }

  if (!sections.skills) {
    recommendations.push(
      "Add a dedicated skills section containing relevant technical skills and technologies."
    );
  }

  if (!sections.experience) {
    recommendations.push(
      "Add work experience, internship experience, or relevant practical experience."
    );
  }

  if (!sections.education) {
    recommendations.push(
      "Add your educational qualifications with degree, institution, and relevant details."
    );
  }

  if (!sections.projects) {
    recommendations.push(
      "Add relevant projects that demonstrate your technical and problem-solving abilities."
    );
  }

  if (skills.length < 5) {
    recommendations.push(
      "Add more relevant technical skills that match the roles you are applying for."
    );
  }

  if (actionVerbs.length < 3) {
    recommendations.push(
      "Use stronger action verbs such as developed, implemented, designed, optimized, and deployed."
    );
  }

  if (quantifiableAchievements.total === 0) {
    recommendations.push(
      "Add measurable achievements using numbers, percentages, performance improvements, or user counts."
    );
  }

  if (!contactInformation.email) {
    recommendations.push(
      "Add a professional email address to your resume."
    );
  }

  if (!contactInformation.phone) {
    recommendations.push(
      "Add a valid phone number so recruiters can contact you easily."
    );
  }

  if (atsCompatibility.score < 70) {
    recommendations.push(
      "Improve ATS compatibility by using standard sections, relevant keywords, measurable achievements, and clear resume structure."
    );
  }

  if (wordCount < 200) {
    recommendations.push(
      "Your resume appears too short. Add relevant details about projects, experience, skills, and achievements."
    );
  }

  if (wordCount > 1500) {
    recommendations.push(
      "Your resume may be too long. Remove unnecessary or repetitive information."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your resume has a strong basic structure. Focus on tailoring keywords and achievements to each job description."
    );
  }

  return recommendations;
};

/* ============================================
   OVERALL SCORE
============================================ */

const calculateOverallScore = ({
  sectionScore,
  skillScore,
  lengthScore,
  contentScore
}) => {
  return Math.round(
    sectionScore * 0.30 +
    skillScore * 0.30 +
    lengthScore * 0.15 +
    contentScore * 0.25
  );
};

/* ============================================
   MAIN ANALYZER
============================================ */

const analyzeResume = (text) => {
  if (!text || !text.trim()) {
    throw new Error("Resume text is empty");
  }

  const wordCount =
    calculateWordCount(text);

  const sections =
    findSections(text);

  const skills =
    findSkills(text);

  const actionVerbs =
    findActionVerbs(text);

  const quantifiableAchievements =
    findQuantifiableAchievements(text);

  const contactInformation =
    extractContactInformation(text);

  const sectionScore =
    calculateSectionScore(sections);

  const skillScore =
    calculateSkillScore(skills);

  const lengthScore =
    calculateLengthScore(wordCount);

  const contentScore =
    calculateContentScore({
      text,
      wordCount,
      actionVerbs,
      quantifiableAchievements
    });

  const detailedSectionScores =
    calculateDetailedSectionScores({
      sections,
      skills,
      actionVerbs,
      quantifiableAchievements
    });

  const atsCompatibility =
    calculateATSScore({
      sections,
      skills,
      contactInformation,
      actionVerbs,
      quantifiableAchievements,
      wordCount
    });

  const strengths =
    generateStrengths({
      sections,
      skills,
      wordCount,
      actionVerbs,
      quantifiableAchievements
    });

  const weaknesses =
    generateWeaknesses({
      sections,
      skills,
      wordCount,
      actionVerbs,
      quantifiableAchievements
    });

  const recommendations =
    generateRecommendations({
      sections,
      skills,
      wordCount,
      actionVerbs,
      quantifiableAchievements,
      contactInformation,
      atsCompatibility
    });

  const overallScore =
    calculateOverallScore({
      sectionScore,
      skillScore,
      lengthScore,
      contentScore
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

    contentScore,

    detailedSectionScores,

    strengths,

    weaknesses,

    contactInformation,

    actionVerbs,

    quantifiableAchievements,

    atsCompatibility,

    recommendations
  };
};

module.exports = {
  analyzeResume
};