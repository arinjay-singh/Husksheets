/**
 * @file auth-context.tsx
 * @brief The authentication context of the application.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

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

// authentication context type interface
// login and logout functions to change isAuthenticated state
// loading state to prevent being kicked out of the app while checking authentication
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

// create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// authentication provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // authentication state to store whether the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // router to redirect the user to the login page
  const router = useRouter();

  // check if the user is authenticated when the component mounts
  useEffect(() => {
    const savedAuthState = localStorage.getItem("isAuthenticated");
    if (savedAuthState === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // login function to authenticate user and redirect to the home page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    router.push("/");
  };

  // logout function to deauthenticate user and redirect to the login page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  // context value to provide the authentication state and functions
  // dependencies: isAuthenticated, login, logout
  const contextValue = useMemo(
    () => ({
      isAuthenticated: isAuthenticated || false,
      login,
      logout,
      loading: isAuthenticated === null,
    }),
    [isAuthenticated, login, logout]
  );

  // render the authentication context provider based on the context value
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
