const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const jwt = require("jsonwebtoken");
// SIGNUP
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // 🔥 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: firstName + " " + lastName,
          email,
          password: hashedPassword,
          role
        }
      ]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "User registered ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email, password);

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("DB user:", data);

    if (error || !data) {
      return res.status(400).json({ error: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password ❌" });
    }

    const token = jwt.sign(
      { id: data.id, role: data.role },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: data.id,
        name: data.name,
        role: data.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;