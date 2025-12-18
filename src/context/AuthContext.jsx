import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  employees: null,
  error: null,
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}