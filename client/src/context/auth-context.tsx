"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedAuthState = localStorage.getItem("isAuthenticated");
    if (savedAuthState === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    router.push("/");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

const contextValue = useMemo(() => ({
    isAuthenticated: isAuthenticated || false,
    login,
    logout,
    loading: isAuthenticated === null,
}), [isAuthenticated, login, logout]);

console.log(isAuthenticated);

return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
