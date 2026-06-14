import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LeaveList() {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []); // eslint-disable-line

  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://loginapp-backend-8847.onrender.com/api/leaves/my",
      { headers: { Authorization: token } }
    );
    setLeaves(res.data);
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "green";
    if (status === "Rejected") return "red";
    return "orange";
  };

  return (
    <div>
      <h2>My Leave Applications</h2>
      <button onClick={() => navigate("/apply-leave")}>➕ Apply New Leave</button>
      &nbsp;
      <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
      <br/><br/>
      <table border="1">
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id}>
              <td>{leave.leave_name}</td>
              <td>{new Date(leave.from_date).toLocaleDateString()}</td>
              <td>{new Date(leave.to_date).toLocaleDateString()}</td>
              <td>{leave.total_days}</td>
              <td>{leave.reason}</td>
              <td style={{ color: getStatusColor(leave.status) }}>
                {leave.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveList;