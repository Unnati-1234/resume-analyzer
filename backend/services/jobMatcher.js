const SKILL_ALIASES = {
  javascript: ["javascript", "js"],
  typescript: ["typescript", "ts"],
  react: ["react", "react.js", "reactjs"],
  nodejs: ["node.js", "nodejs", "node js"],
  express: ["express", "express.js", "expressjs"],
  mongodb: ["mongodb", "mongo db", "mongo"],
  postgresql: ["postgresql", "postgres", "postgre sql"],
  mysql: ["mysql", "my sql"],
  python: ["python"],
  java: ["java"],
  cpp: ["c++", "cpp"],
  c: ["c programming"],
  html: ["html", "html5"],
  css: ["css", "css3"],
  tailwind: ["tailwind", "tailwind css"],
  bootstrap: ["bootstrap"],
  git: ["git"],
  github: ["github"],
  docker: ["docker"],
  kubernetes: ["kubernetes", "k8s"],
  aws: ["aws", "amazon web services"],
  azure: ["azure", "microsoft azure"],
  sql: ["sql"],
  restapi: ["rest api", "restful api", "rest"],
  nextjs: ["next.js", "nextjs", "next js"],
  angular: ["angular", "angular.js"],
  vue: ["vue", "vue.js", "vuejs"],
  machinelearning: [
    "machine learning",
    "machine-learning",
    "ml"
  ],
  dataanalysis: [
    "data analysis",
    "data analytics"
  ],
  pandas: ["pandas"],
  numpy: ["numpy"],
  tensorflow: ["tensorflow"],
  pytorch: ["pytorch"],
  communication: ["communication"],
  leadership: ["leadership"],
  problemsolving: [
    "problem solving",
    "problem-solving"
  ],
  teamwork: ["teamwork", "team work"],
  agile: ["agile"],
  scrum: ["scrum"]
};

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
};

const containsSkill = (text, skillVariant) => {
  const normalizedText = normalizeText(text);

  const escapedSkill = skillVariant.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(^|[^a-z0-9+#.])${escapedSkill}([^a-z0-9+#.]|$)`,
    "i"
  );

  return regex.test(normalizedText);
};

const extractSkills = (text) => {
  const foundSkills = [];

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

  return foundSkills;
};

const calculateMatchScore = (resumeSkills, jobSkills) => {
  if (jobSkills.length === 0) {
    return 0;
  }

  const matchingSkills = jobSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  return Math.round(
    (matchingSkills.length / jobSkills.length) * 100
  );
};

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

const matchResumeWithJob = (resumeText, jobDescription) => {
  if (!resumeText || !resumeText.trim()) {
    throw new Error("Resume text is empty");
  }

  if (!jobDescription || !jobDescription.trim()) {
    throw new Error("Job description is empty");
  }

  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);

  const matchingSkills = jobSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  const missingSkills = jobSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );

  const matchScore = calculateMatchScore(
    resumeSkills,
    jobSkills
  );

  return {
    matchScore,
    matchLevel: getMatchLevel(matchScore),
    resumeSkills,
    jobSkills,
    matchingSkills,
    missingSkills,
    matchingSkillCount: matchingSkills.length,
    missingSkillCount: missingSkills.length
  };
};

module.exports = {
  matchResumeWithJob
};