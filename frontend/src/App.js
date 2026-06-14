import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import CreateEmployee from "./pages/CreateEmployee";
import Departments from "./pages/Departments";
import Skills from "./pages/Skills";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveList from "./pages/LeaveList";
import ProtectedRoute from "./routes/ProtectedRoute";
import ManageLeaves from "./pages/ManageLeaves";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/employees" element={
          <ProtectedRoute><EmployeeList /></ProtectedRoute>
        } />
        <Route path="/employees/create" element={
          <ProtectedRoute><CreateEmployee /></ProtectedRoute>
        } />
        <Route path="/departments" element={
          <ProtectedRoute><Departments /></ProtectedRoute>
        } />
        <Route path="/skills" element={
          <ProtectedRoute><Skills /></ProtectedRoute>
        } />
        <Route path="/apply-leave" element={
          <ProtectedRoute><ApplyLeave /></ProtectedRoute>
        } />
        <Route path="/my-leaves" element={
          <ProtectedRoute><LeaveList /></ProtectedRoute>
        } />
        <Route path="/manage-leaves" element={
         <ProtectedRoute><ManageLeaves /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;