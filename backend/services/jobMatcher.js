const SKILL_ALIASES = {
  javascript: ["javascript", "java script", "js"],
  typescript: ["typescript", "type script", "ts"],

  react: ["react", "react.js", "reactjs"],
  nodejs: ["node.js", "nodejs", "node js", "node"],

  express: ["express", "express.js", "expressjs"],

  mongodb: ["mongodb", "mongo db", "mongo"],

  postgresql: [
    "postgresql",
    "postgres",
    "postgre sql",
    "postgres db"
  ],

  mysql: ["mysql", "my sql"],

  python: ["python", "python3"],
  java: ["java"],

  cpp: ["c++", "cpp", "c plus plus"],

  c: [
    "c programming",
    "c language"
  ],

  html: ["html", "html5"],
  css: ["css", "css3"],

  tailwind: ["tailwind", "tailwind css"],
  bootstrap: ["bootstrap"],

  git: ["git", "git version control"],
  github: ["github"],

  docker: [
    "docker",
    "docker container",
    "docker containers"
  ],

  kubernetes: [
    "kubernetes",
    "k8s",
    "kube"
  ],

  aws: [
    "aws",
    "amazon web services",
    "amazon cloud"
  ],

  azure: [
    "azure",
    "microsoft azure"
  ],

  sql: [
    "sql",
    "structured query language",
    "sql server",
    "sql database",
    "sql databases"
  ],

  restapi: [
    "rest api",
    "rest apis",
    "restful api",
    "restful apis",
    "rest-api",
    "restful-api"
  ],

  nextjs: [
    "next.js",
    "nextjs",
    "next js"
  ],

  angular: [
    "angular",
    "angular.js",
    "angularjs"
  ],

  vue: [
    "vue",
    "vue.js",
    "vuejs"
  ],

  machinelearning: [
    "machine learning",
    "machine-learning",
    "machinelearning",
    "ml"
  ],

  dataanalysis: [
    "data analysis",
    "data analytics",
    "data-analysis",
    "data analyst"
  ],

  pandas: ["pandas"],
  numpy: ["numpy"],

  tensorflow: [
    "tensorflow",
    "tensor flow"
  ],

  pytorch: [
    "pytorch",
    "py torch"
  ],

  communication: [
    "communication",
    "communication skills"
  ],

  leadership: [
    "leadership",
    "leadership skills"
  ],

  problemsolving: [
    "problem solving",
    "problem-solving",
    "problem solving skills"
  ],

  teamwork: [
    "teamwork",
    "team work",
    "team working",
    "team collaboration"
  ],

  agile: [
    "agile",
    "agile methodology",
    "agile development"
  ],

  scrum: [
    "scrum",
    "scrum methodology"
  ]
};


// --------------------------------------------------
// Related skills
// --------------------------------------------------

const RELATED_SKILLS = {
  sql: ["postgresql", "mysql"],

  postgresql: ["sql"],
  mysql: ["sql"],

  nodejs: ["express"],
  express: ["nodejs"],

  javascript: ["typescript"],
  typescript: ["javascript"],

  react: ["javascript"],
  nextjs: ["react", "javascript"],

  angular: ["javascript"],
  vue: ["javascript"],

  tailwind: ["css"],
  bootstrap: ["css"]
};


// --------------------------------------------------
// Normalize text
// --------------------------------------------------

const normalizeText = (text) => {
  return String(text || "")
    .toLowerCase()
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/[–—−]/g, "-")
    .replace(/[ \t]+/g, " ")
    .trim();
};


// --------------------------------------------------
// Escape regex characters
// --------------------------------------------------

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


// --------------------------------------------------
// Check whether a skill exists
// --------------------------------------------------

const containsSkill = (text, skillVariant) => {
  const normalizedText = normalizeText(text);
  const normalizedSkill = normalizeText(skillVariant);

  if (!normalizedText || !normalizedSkill) {
    return false;
  }

  const escapedSkill = escapeRegex(normalizedSkill);

  const regex = new RegExp(
    `(^|[^a-z0-9])${escapedSkill}(?=$|[^a-z0-9])`,
    "i"
  );

  return regex.test(normalizedText);
};


// --------------------------------------------------
// Extract skills
// --------------------------------------------------

const extractSkills = (text) => {
  const foundSkills = [];

  if (!text || !text.trim()) {
    return foundSkills;
  }

  Object.entries(SKILL_ALIASES).forEach(
    ([canonicalSkill, aliases]) => {
      const found = aliases.some((alias) =>
        containsSkill(text, alias)
      );

      if (found) {
        foundSkills.push(canonicalSkill);
      }
    }
  );

  return [...new Set(foundSkills)];
};


// --------------------------------------------------
// Determine skill status
// --------------------------------------------------

const getSkillStatus = (
  resumeSkills,
  requiredSkill
) => {
  if (resumeSkills.includes(requiredSkill)) {
    return "matched";
  }

  const relatedSkills =
    RELATED_SKILLS[requiredSkill] || [];

  if (
    relatedSkills.some((skill) =>
      resumeSkills.includes(skill)
    )
  ) {
    return "related";
  }

  return "missing";
};


// --------------------------------------------------
// Calculate match score
// --------------------------------------------------

const calculateMatchScore = (
  resumeSkills,
  jobSkills
) => {
  if (!jobSkills || jobSkills.length === 0) {
    return 0;
  }

  let totalPoints = 0;

  jobSkills.forEach((skill) => {
    const status = getSkillStatus(
      resumeSkills,
      skill
    );

    if (status === "matched") {
      totalPoints += 1;
    } else if (status === "related") {
      totalPoints += 0.5;
    }
  });

  return Math.round(
    (totalPoints / jobSkills.length) * 100
  );
};


// --------------------------------------------------
// Match level
// --------------------------------------------------

const getMatchLevel = (score) => {
  if (score >= 80) {
    return "Excellent";
  }

  if (score >= 60) {
    return "Good";
  }

  if (score >= 40) {
    return "Moderate";
  }

  return "Low";
};


// --------------------------------------------------
// Generate recommendations
// --------------------------------------------------

const generateRecommendations = ({
  missingSkills,
  relatedSkills,
  matchScore
}) => {
  const recommendations = [];

  if (missingSkills.length > 0) {
    recommendations.push(
      `Consider adding or developing these skills: ${missingSkills.join(
        ", "
      )}.`
    );
  }

  if (relatedSkills.length > 0) {
    recommendations.push(
      `You have related experience in: ${relatedSkills.join(
        ", "
      )}. If you have direct experience with the required technologies, mention them explicitly in your resume.`
    );
  }

  if (matchScore < 40) {
    recommendations.push(
      "Your resume has limited overlap with this job description. Consider tailoring your resume more closely to the required technologies and skills."
    );
  } else if (matchScore < 60) {
    recommendations.push(
      "Your resume has some relevant skills, but several job requirements are missing. Tailor your skills and project descriptions to the role."
    );
  } else if (matchScore < 80) {
    recommendations.push(
      "Your resume matches many of the job requirements. Add relevant missing skills where you genuinely have experience."
    );
  } else {
    recommendations.push(
      "Your resume has strong alignment with the skills mentioned in this job description."
    );
  }

  return recommendations;
};


// --------------------------------------------------
// Main matching function
// --------------------------------------------------

const matchResumeWithJob = (
  resumeText,
  jobDescription
) => {
  if (!resumeText || !resumeText.trim()) {
    throw new Error("Resume text is empty");
  }

  if (
    !jobDescription ||
    !jobDescription.trim()
  ) {
    throw new Error("Job description is empty");
  }

  const resumeSkills =
    extractSkills(resumeText);

  const jobSkills =
    extractSkills(jobDescription);

  const matchingSkills = [];
  const relatedSkills = [];
  const missingSkills = [];

  jobSkills.forEach((skill) => {
    const status = getSkillStatus(
      resumeSkills,
      skill
    );

    if (status === "matched") {
      matchingSkills.push(skill);
    } else if (status === "related") {
      relatedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchScore =
    calculateMatchScore(
      resumeSkills,
      jobSkills
    );

  const recommendations =
    generateRecommendations({
      missingSkills,
      relatedSkills,
      matchScore
    });

  return {
    matchScore,

    matchLevel:
      getMatchLevel(matchScore),

    resumeSkills,

    jobSkills,

    matchingSkills,

    relatedSkills,

    missingSkills,

    matchingSkillCount:
      matchingSkills.length,

    relatedSkillCount:
      relatedSkills.length,

    missingSkillCount:
      missingSkills.length,

    recommendations
  };
};


// --------------------------------------------------
// Export
// --------------------------------------------------

module.exports = {
  matchResumeWithJob
};
