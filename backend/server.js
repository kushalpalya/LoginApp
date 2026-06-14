require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const departmentRoutes = require("./routes/departments");
const employeeRoutes = require("./routes/employees");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
const skillRoutes = require("./routes/skills");
app.use("/api/skills", skillRoutes);
const leaveRoutes = require("./routes/leaves");
app.use("/api/leaves", leaveRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});