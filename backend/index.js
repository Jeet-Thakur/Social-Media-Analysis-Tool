// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(express.json());

// Verify database connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err.message));

// ✅ Save Collaboration Request
app.post("/api/company", async (req, res) => {
  const { company_name, selected_channel, collaboration_goals, region, genre } = req.body;

  // Validate input
  if (!company_name || !selected_channel || !collaboration_goals || !region || !genre) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Insert data into the collaborations table
    const query = `
      INSERT INTO collaborations (company_name, selected_channel, collaboration_goals, region, genre)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [company_name, selected_channel, collaboration_goals, region, genre];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Collaboration request saved successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error saving collaboration request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get All Collaborations
app.get("/collaborations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM collaborations ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error retrieving collaborations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, name: user.full_name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Register (Signup) Endpoint
app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email",
      [fullName, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Guest Login Endpoint
app.post("/guest", async (req, res) => {

  try {
    const guestUser = { id: "guest", role: "guest" };
    const token = jwt.sign(guestUser, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("❌ Error during guest login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});