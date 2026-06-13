import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEmployee() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    department_id: "",
    phone: "",
    address: "",
    designation: "",
    salary: ""
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/departments")
      .then(res => setDepartments(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create employee
      const res = await axios.post("http://localhost:5000/api/employees", form);
      const employeeId = res.data.id;

      // Step 2: Upload images if any
      if (images.length > 0) {
        const formData = new FormData();
        for (let img of images) {
          formData.append("images", img);
        }
        await axios.post(
          `http://localhost:5000/api/employees/upload/${employeeId}`,
          formData
        );
      }

      alert("Employee Created with Images!");
      navigate("/employees");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="user_id" placeholder="User ID" onChange={handleChange} />
        <br/><br/>
        <select name="department_id" onChange={handleChange}>
          <option value="">Select Department</option>
          {departments.map(dep => (
            <option key={dep.id} value={dep.id}>
              {dep.department_name}
            </option>
          ))}
        </select>
        <br/><br/>
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <br/><br/>
        <input name="address" placeholder="Address" onChange={handleChange} />
        <br/><br/>
        <input name="designation" placeholder="Designation" onChange={handleChange} />
        <br/><br/>
        <input name="salary" placeholder="Salary" onChange={handleChange} />
        <br/><br/>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
        />
        <br/><br/>
        <button type="submit">Create Employee</button>
        &nbsp;
        <button type="button" onClick={() => navigate("/dashboard")}>Back</button>
      </form>
    </div>
  );
}

export default CreateEmployee;