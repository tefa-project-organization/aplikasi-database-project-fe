import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.jsx";
import Dashboard from "@/pages/Dashboard/Dashboard.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
