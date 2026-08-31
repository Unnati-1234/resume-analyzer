const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const {
  validateRegister,
  validateLogin
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  validateRegister,
  registerUser
);

router.post(
  "/login",
  validateLogin,
  loginUser
);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;