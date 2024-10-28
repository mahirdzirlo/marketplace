const express = require("express");
const router = express.Router();
const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username.trim(),
    ]);

    const user = result?.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { id: user.id, username: username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({ token, user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("login error", error);
    res.status(500).send();
  }
});

module.exports = router;
