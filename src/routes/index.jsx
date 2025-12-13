import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Dashboard from "@/pages/Dashboard/Dashboard";
import Projects from "@/pages/Projects/Projects";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import UserManagement from "@/pages/UserManagement/UserManage";
import Team from "@/pages/Team/Team";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Redirect root ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* App pages dengan layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/usermanagement" element={<UserManagement />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
