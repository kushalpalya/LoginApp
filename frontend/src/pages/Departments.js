import { useState, useEffect } from "react";
import axios from "axios";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    axios.get("http://localhost:5000/api/departments")
      .then(res => setDepartments(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/departments", {
      department_name: name
    });
    alert("Department Added!");
    setName("");
    fetchDepartments();
  };

  return (
    <div>
      <h2>Departments</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add Department</button>
      </form>

      <ul>
        {departments.map(dep => (
          <li key={dep.id}>{dep.department_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Departments;