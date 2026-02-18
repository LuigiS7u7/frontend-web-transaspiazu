import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ResetPassword from "./pages/ResetPassword"; 

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* DASHBOARD */}
      <Route path="/admin/dashboard/*" element={<Dashboard />} />

      {/* RESET PASSWORD (SIN LOGIN) */}
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* REDIRECCIONES */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;






