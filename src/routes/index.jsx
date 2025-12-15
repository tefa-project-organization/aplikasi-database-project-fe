import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Login from "@/pages/Auth/Login";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Projects from "@/pages/Projects/Projects";
import Team from "@/pages/Team/Team";
import UserManagement from "@/pages/UserManagement/UserManage";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* ROOT → LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* APP (Protected nanti) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/usermanagement" element={<UserManagement />} />
        </Route>

        {/* NOT FOUND */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}