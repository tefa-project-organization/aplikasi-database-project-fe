import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function PublicRoute({ children }) {
  const { employees } = useAuth()

  if (employees) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
