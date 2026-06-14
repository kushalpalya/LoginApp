const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/auth");

// Get all leave types
router.get("/types", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leave_types");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Apply for leave
router.post("/apply", auth, async (req, res) => {
  try {
    const { leave_type_id, from_date, to_date, reason } = req.body;
    const employee_id = req.user.id;

    // Calculate total days
    const from = new Date(from_date);
    const to = new Date(to_date);
    const total_days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const result = await pool.query(
      `INSERT INTO leave_applications(employee_id, leave_type_id, from_date, to_date, total_days, reason, status)
       VALUES($1,$2,$3,$4,$5,$6,'Pending') RETURNING *`,
      [employee_id, leave_type_id, from_date, to_date, total_days, reason]
    );

    res.json({ message: "Leave Applied!", leave: result.rows[0] });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Get my leaves
router.get("/my", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT la.*, lt.leave_name 
       FROM leave_applications la
       JOIN leave_types lt ON la.leave_type_id = lt.id
       WHERE la.employee_id = $1
       ORDER BY la.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Get all leaves (manager/HR/admin)
router.get("/all", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT la.*, lt.leave_name, u.name as employee_name
       FROM leave_applications la
       JOIN leave_types lt ON la.leave_type_id = lt.id
       JOIN users u ON la.employee_id = u.id
       ORDER BY la.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Approve or Reject leave
router.put("/action/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, remarks } = req.body;

    // Transaction - update both tables together
    await pool.query("BEGIN");

    await pool.query(
      "UPDATE leave_applications SET status=$1 WHERE id=$2",
      [action, id]
    );

    await pool.query(
      `INSERT INTO approval_history(leave_id, approved_by, action, remarks)
       VALUES($1,$2,$3,$4)`,
      [id, req.user.id, action, remarks]
    );

    await pool.query("COMMIT");

    res.json({ message: `Leave ${action}!` });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json(error.message);
  }
});

module.exports = router;