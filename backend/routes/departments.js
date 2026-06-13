const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all departments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM departments");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Add department
router.post("/", async (req, res) => {
  try {
    const { department_name } = req.body;
    const result = await pool.query(
      "INSERT INTO departments(department_name) VALUES($1) RETURNING *",
      [department_name]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;