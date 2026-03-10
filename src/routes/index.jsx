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
import History from "@/pages/History/History"
import UploadDocuments from "@/pages/dokumen/UploadDocuments"
import TeamDetailPage from "@/pages/Team/TeamDetail"
import { routePermissions } from "@/config/permission"

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
        <Route element={<PrivateRoute roles={routePermissions.dashboard} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute roles={routePermissions.projects} />}>
          <Route element={<MainLayout />}>
            <Route path="/projects" element={<Projects />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute roles={routePermissions.team} />}>
          <Route element={<MainLayout />}>
            <Route path="/team" element={<Team />} />
            <Route path="/team/:id" element={<TeamDetailPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute roles={routePermissions.usermanagement} />}>
          <Route element={<MainLayout />}>
            <Route path="/usermanagement" element={<UserManagement />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute roles={routePermissions.history} />}>
          <Route element={<MainLayout />}>
            <Route path="/history" element={<History />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute roles={routePermissions.uploadDocuments} />}>
          <Route element={<MainLayout />}>
            <Route path="/upload-documents" element={<UploadDocuments />} />
          </Route>
        </Route>

        <Route path="/404" element={<ErrorPage />} />

        {/* NOT FOUND */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}