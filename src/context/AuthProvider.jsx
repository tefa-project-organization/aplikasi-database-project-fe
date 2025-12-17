// src\context\AuthProvider.jsx
import { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { apiPost, apiLogout } from "@/lib/api";
import { CREATE_LOGIN, GET_LOGOUT } from "@/constants/api/auth";

export default function AuthProvider({ children }) {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("employees");
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // LOGIN - stabilkan dengan useCallback
  const login = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);

    const res = await apiPost(CREATE_LOGIN, payload);

    if (res.error) {
      setIsAuthenticated(false);
      setIsLoading(false);
      setError(res.message);
      throw new Error(res.message);
    }

    const userData = res.data?.data || null;
    setEmployees(userData);
    setIsAuthenticated(true);
    localStorage.setItem("employees", JSON.stringify(userData));
    setIsLoading(false);
    
    return { success: true, data: userData };
  }, []);

  // LOGOUT - stabilkan dengan useCallback dan handle 401 error
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Coba API logout, tapi jangan throw error untuk 401
      await apiLogout(GET_LOGOUT);
    } catch (err) {
      // Ignore 401 errors (token sudah invalid)
      if (err?.response?.status !== 401) {
        console.error("Logout API error:", err);
      }
    }

    // SELALU clear data lokal
    setEmployees(null);
    setIsAuthenticated(false);
    localStorage.removeItem("employees");
    setIsLoading(false);

    return { success: true };
  }, []);

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