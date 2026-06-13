import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    skills: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("https://loginapp-backend-8847.onrender.com/api/auth/profile", {
      headers: { Authorization: token }
    })
    .then(res => setUser(res.data))
    .catch(() => navigate("/"));

    // Get stats
    axios.get("https://loginapp-backend-8847.onrender.com/api/employees")
      .then(res => setStats(prev => ({ ...prev, employees: res.data.length })));
    axios.get("https://loginapp-backend-8847.onrender.com/api/departments")
      .then(res => setStats(prev => ({ ...prev, departments: res.data.length })));
    axios.get("https://loginapp-backend-8847.onrender.com/api/skills")
      .then(res => setStats(prev => ({ ...prev, skills: res.data.length })));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Welcome, {user.name}! 👋</h1>
      <p>Email: {user.email}</p>

      <hr/>

      <h3>📊 Statistics</h3>
      <div>
        <button>👥 Employees: {stats.employees}</button>
        &nbsp;
        <button>🏢 Departments: {stats.departments}</button>
        &nbsp;
        <button>🎯 Skills: {stats.skills}</button>
      </div>

      <hr/>

      <h3>Navigation</h3>
      <button onClick={() => navigate("/employees")}>👥 Employee List</button>
      &nbsp;
      <button onClick={() => navigate("/employees/create")}>➕ Create Employee</button>
      &nbsp;
      <button onClick={() => navigate("/departments")}>🏢 Departments</button>
      &nbsp;
      <button onClick={() => navigate("/skills")}>🎯 Skills</button>
      &nbsp;
      <button onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
}

export default Dashboard;