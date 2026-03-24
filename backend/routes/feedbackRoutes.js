const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// ✅ SUBMIT FEEDBACK (Student)
router.post("/", async (req, res) => {
  const {
    userId,
    role,
    category,
    mood,
    tags,
    aspects,
    message,
    section
  } = req.body;

  try {
    const { data, error } = await supabase
      .from("feedback")
      .insert([
        {
          user_id: userId,
          role,
          category,
          mood,
          tags,
          aspects,
          message,
          section
        }
      ]);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Feedback submitted ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL FEEDBACK (Admin / Teacher)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET MY FEEDBACK (Student)
router.get("/my/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("user_id", userId);

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;