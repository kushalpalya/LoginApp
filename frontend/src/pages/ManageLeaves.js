import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageLeaves() {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []); // eslint-disable-line

  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://loginapp-backend-8847.onrender.com/api/leaves/all",
      { headers: { Authorization: token } }
    );
    setLeaves(res.data);
  };

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    const remarks = prompt(`Enter remarks for ${action}:`);
    await axios.put(
      `https://loginapp-backend-8847.onrender.com/api/leaves/action/${id}`,
      { action, remarks },
      { headers: { Authorization: token } }
    );
    alert(`Leave ${action}!`);
    fetchLeaves();
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "green";
    if (status === "Rejected") return "red";
    return "orange";
  };

  return (
    <div>
      <h2>Manage Leave Applications</h2>
      <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
      <br/><br/>
      <table border="1">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id}>
              <td>{leave.employee_name}</td>
              <td>{leave.leave_name}</td>
              <td>{new Date(leave.from_date).toLocaleDateString()}</td>
              <td>{new Date(leave.to_date).toLocaleDateString()}</td>
              <td>{leave.total_days}</td>
              <td>{leave.reason}</td>
              <td style={{ color: getStatusColor(leave.status) }}>
                {leave.status}
              </td>
              <td>
                {leave.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleAction(leave.id, "Approved")}
                      style={{ color: "green" }}
                    >
                      ✅ Approve
                    </button>
                    &nbsp;
                    <button
                      onClick={() => handleAction(leave.id, "Rejected")}
                      style={{ color: "red" }}
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageLeaves;