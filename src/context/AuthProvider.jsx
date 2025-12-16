import { useState } from "react";
import { AuthContext } from "./AuthContext";

import { apiPost, apiLogout } from "@/lib/api";
import { CREATE_LOGIN, GET_LOGOUT } from "@/constants/api/auth";

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setemployees] = useState(null);
  const [error, setError] = useState(null);

  // LOGIN
  async function login(payload) {
    setIsLoading(true);
    setError(null);

    const res = await apiPost(CREATE_LOGIN, payload);

    if (res.error) {
      setIsAuthenticated(false);
      setIsLoading(false);
      setError(res.message);
      throw new Error(res.message);
    }

    // cookie diset oleh server
    setIsAuthenticated(true);
    setemployees(res.data?.data || null);
    setIsLoading(false);

    return res;
  }

  // LOGOUT
  async function logout() {
    setIsLoading(true);
    setError(null);

    await apiLogout(GET_LOGOUT);

    setIsAuthenticated(false);
    setemployees(null);
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        employees,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
