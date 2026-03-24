const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// ✅ CREATE CONCERN
router.post("/", async (req, res) => {
  const {
    userId,
    title,
    category,
    description,
    priority,
    anonymous
  } = req.body;

  try {
    const { data, error } = await supabase
      .from("concerns")
      .insert([
        {
          user_id: userId,
          title,
          category,
          description,
          priority,
          anonymous
        }
      ]);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Concern submitted ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL (Admin)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("concerns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET MY (Student / Staff)
router.get("/my/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("concerns")
      .select("*")
      .eq("user_id", userId);

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE STATUS (Admin)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from("concerns")
      .update({ status })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Status updated ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;