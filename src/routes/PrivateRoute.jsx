import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext.jsx"

export default function PrivateRoute() {
  const { employees } = useAuth()

  if (!employees) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
