const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const multer = require("multer");
const path = require("path");

// Image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { files: 5 } });

// Get all employees
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ep.*, u.name, u.email, d.department_name
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Create employee
router.post("/", async (req, res) => {
  try {
    const { user_id, department_id, phone, address, designation, salary } = req.body;
    const result = await pool.query(
      `INSERT INTO employee_profiles(user_id, department_id, phone, address, designation, salary)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, department_id, phone, address, designation, salary]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Upload images
router.post("/upload/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    for (const file of files) {
      await pool.query(
        "INSERT INTO employee_images(employee_id, image_url) VALUES($1,$2)",
        [id, file.filename]
      );
    }
    res.json({ message: "Images uploaded successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM employee_profiles WHERE id=$1", [req.params.id]);
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;