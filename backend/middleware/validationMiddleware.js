const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must contain at least 2 characters"
    });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long"
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};