// src\context\AuthProvider.jsx
import { useState } from "react";
import { AuthContext } from "./AuthContext";

import { apiPost, apiLogout } from "@/lib/api";
import { CREATE_LOGIN, GET_LOGOUT } from "@/constants/api/auth";

export default function AuthProvider({ children }) {

  const [employees, setemployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("employees");
  });

  const [isLoading, setIsLoading] = useState(false);
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

    const userData = res.data?.data || null;

    setemployees(userData);
    setIsAuthenticated(true);

    // persist
    localStorage.setItem("employees", JSON.stringify(userData));

    setIsLoading(false);
    
    // RETURN DATA untuk memberi tahu bahwa login sukses
    return { success: true, data: userData };
  }

  // LOGOUT
  async function logout() {
    setIsLoading(true);
    setError(null);

    await apiLogout(GET_LOGOUT);

    setemployees(null);
    setIsAuthenticated(false);

    // clear storage
    localStorage.removeItem("employees");

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