import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import MainLayout from "@/layouts/MainLayout"
import Login from "@/pages/Auth/Login"
import Logout from "@/pages/Auth/Logout"
import Dashboard from "@/pages/Dashboard/Dashboard"
import Projects from "@/pages/Projects/Projects"
import Team from "@/pages/Team/Team"
import UserManagement from "@/pages/UserManagement/Hooks/UserManagement"
import ErrorPage from "@/pages/ErrorPage/ErrorPage"
import PrivateRoute from "./PrivateRoute"
import PublicRoute from "./PublicRoute"

export default function AppRoutes() {
  return (
    <BrowserRouter>  
      <Routes>
        {/* ROOT -> LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN (PUBLIC) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* LOGOUT (PUBLIC - bisa diakses tanpa auth) */}
        <Route path="/logout" element={<Logout />} />

        {/* APP (PROTECTED) */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/team" element={<Team />} />
            <Route path="/usermanagement" element={<UserManagement />} />
          </Route>
        </Route>

        {/* NOT FOUND */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}