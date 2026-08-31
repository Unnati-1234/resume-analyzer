const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

const parsePDF = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);

  return data.text;
};

const parseDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({
    path: filePath
  });

  return result.value;
};

const parseResume = async (filePath, fileType) => {
  if (fileType === "application/pdf") {
    return await parsePDF(filePath);
  }

  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await parseDOCX(filePath);
  }

  if (fileType === "application/msword") {
    throw new Error("DOC files are not supported for text extraction yet");
  }

  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    return await parsePDF(filePath);
  }

  if (extension === ".docx") {
    return await parseDOCX(filePath);
  }

  throw new Error("Unsupported resume file format");
};

module.exports = {
  parseResume
};