import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import LandingPg from "../pages/Landing/LandingPg";
import Dashboard from "../pages/Dashboard/Dashboard";
import Projects from "../pages/Projects/Projects";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Redirect root ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Landing Page */}
        <Route path="/landing" element={<LandingPg />} />

        {/* App pages dengan layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
