import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ApplyLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    leave_type_id: "",
    from_date: "",
    to_date: "",
    reason: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://loginapp-backend-8847.onrender.com/api/leaves/types")
      .then(res => setLeaveTypes(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      "https://loginapp-backend-8847.onrender.com/api/leaves/apply",
      form,
      { headers: { Authorization: token } }
    );
    alert("Leave Applied Successfully!");
    navigate("/my-leaves");
  };

  return (
    <div>
      <h2>Apply for Leave</h2>
      <form onSubmit={handleSubmit}>
        <select name="leave_type_id" onChange={handleChange}>
          <option value="">Select Leave Type</option>
          {leaveTypes.map(lt => (
            <option key={lt.id} value={lt.id}>{lt.leave_name}</option>
          ))}
        </select>
        <br/><br/>
        <label>From Date:</label>
        <input type="date" name="from_date" onChange={handleChange} />
        <br/><br/>
        <label>To Date:</label>
        <input type="date" name="to_date" onChange={handleChange} />
        <br/><br/>
        <textarea
          name="reason"
          placeholder="Reason for leave"
          onChange={handleChange}
          rows="4"
          cols="30"
        />
        <br/><br/>
        <button type="submit">Apply Leave</button>
        &nbsp;
        <button type="button" onClick={() => navigate("/dashboard")}>Back</button>
      </form>
    </div>
  );
}

export default ApplyLeave;