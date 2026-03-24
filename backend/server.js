const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
const feedbackRoutes = require("./routes/feedbackRoutes");

app.use("/api/feedback", feedbackRoutes);

const concernRoutes = require("./routes/concernRoutes");

app.use("/api/concerns", concernRoutes);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Supabase Backend Running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});