/**
 * @file auth-context.tsx
 * @brief The authentication context of the application.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 * @author Parnika Jain
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
  auth: AuthData | undefined;
  setAuthData: (a: AuthData) => void;
  login: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}

export interface AuthData {
  username: string;
  password: string;
}

// create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// authentication provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // authentication state to store whether the user is authenticated
  const localStorageKey = "auth";
  const loadAuth = () => {
    if (typeof window !== 'undefined') {
      const savedAuthState = localStorage.getItem(localStorageKey);
      if (!!savedAuthState) {
        const parsed: AuthData = JSON.parse(savedAuthState);
        if (!!parsed.username && !!parsed.password) {
          return parsed;
        }
      }
    } 
    return undefined;
  };
  const [auth, setAuth] = useState<AuthData | undefined>(loadAuth);
  const [loading, setLoading] = useState<boolean>(false);

  // router to redirect the user to the login page
  const router = useRouter();

  // check if the user is authenticated when the component mounts

  // login function to authenticate user and redirect to the home page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const login = () => {
      setLoading(false);
      router.push("/");
  };

  // logout function to deauthenticate user and redirect to the login page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const logout = () => {
    setAuth(undefined);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(localStorageKey);
    }
    router.push("/login");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isAuthenticated = () => !!auth?.username && !!auth?.password;

  // set auth data
  const setAuthData = (data: AuthData) => {
    setAuth(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    }
  }

  // context value to provide the authentication state and functions
  // dependencies: isAuthenticated, login, logout
  const contextValue = useMemo(
    () => ({
      auth,
      setAuthData,
      loading,
      isAuthenticated,
      login,
      logout
    }),
    [auth, login, logout, loading, isAuthenticated]
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
