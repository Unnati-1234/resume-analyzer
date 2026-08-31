const errorMiddleware = (err, req, res, next) => {
  console.error("Backend error:", err.message);

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size is too large"
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err.message === "Only PDF and DOCX files are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
};

module.exports = errorMiddleware;