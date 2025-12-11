import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout"; // relatif aja
import Dashboard from "../pages/Dashboard/Dashboard";
import Projects from "../pages/Projects/Projects";
import UserManagement from "../pages/UserManagement/UserManagement";
import Team from "../pages/Team/Team";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Layout route */}
        <Route path="/" element={<MainLayout />}>
          {/* Child routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="team" element={<Team />} />
          <Route path="user-management" element={<UserManagement />} />
          {/* Optional: index route */}
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
