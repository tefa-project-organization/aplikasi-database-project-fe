import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout"; // relatif aja
import Dashboard from "../pages/Dashboard/Dashboard";
import Projects from "../pages/Projects/Projects";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Layout route */}
        <Route path="/" element={<MainLayout />}>
          {/* Child routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          {/* Optional: index route */}
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
