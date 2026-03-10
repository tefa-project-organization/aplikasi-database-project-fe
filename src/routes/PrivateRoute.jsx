import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function PrivateRoute({ roles }) {

  const { isAuthenticated, employees, isLoading } = useAuth()

  const role = employees?.user?.position?.position_name

  console.log("ROLE:", role)
  console.log("ALLOWED:", roles)

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/404" replace />
  }

  return <Outlet />
}