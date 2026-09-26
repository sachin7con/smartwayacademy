const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const DEMO_EMAIL = process.env.DEMO_EMAIL;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD;

const JWT_SECRET = process.env.JWT_SECRET;
console.log("ADMIN PASSWORD LOADED:", ADMIN_PASSWORD);

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    // REAL ADMIN LOGIN
    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        {
          email,
          role: "admin",
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        token,
        role: "admin",
      });
    }

    // DEMO ADMIN LOGIN
    if (
      email === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      const token = jwt.sign(
        {
          email,
          role: "demo",
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        token,
        role: "demo",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;