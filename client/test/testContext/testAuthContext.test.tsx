/**
 * @file auth-context.test.tsx
 * @brief Tests for the AuthContext component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React, { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import { useRouter } from "next/navigation";
import {
  AuthProvider,
  useAuth,
  AuthData,
} from "../../src/context/auth-context"; // Adjust the import path

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AuthContext", () => {
  const mockRouterPush = jest.fn();
  const testAuthData: AuthData = { username: "testuser", password: "testpass" };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    jest.clearAllMocks();
    localStorage.clear();
  });

  const TestComponent = () => {
    const { auth, login, logout, isAuthenticated, setAuthData } = useAuth();

    return (
      <div>
        <div>Auth: {auth ? `${auth.username}` : "None"}</div>
        <div>Is Authenticated: {isAuthenticated() ? "Yes" : "No"}</div>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
        <button onClick={() => setAuthData(testAuthData)}>Set Auth Data</button>
      </div>
    );
  };

  test("provides default auth state", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Auth: None")).toBeInTheDocument();
    expect(screen.getByText("Is Authenticated: No")).toBeInTheDocument();
  });

  test("sets auth data", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Set Auth Data").click();
    });

    expect(
      screen.getByText(`Auth: ${testAuthData.username}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Is Authenticated: Yes")).toBeInTheDocument();
    expect(localStorage.getItem("auth")).toBe(JSON.stringify(testAuthData));
  });

  test("logs in and redirects to home page", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Login").click();
    });

    expect(mockRouterPush).toHaveBeenCalledWith("/");
  });

  test("logs out and redirects to login page", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Set Auth Data").click();
    });

    act(() => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByText("Auth: None")).toBeInTheDocument();
    expect(screen.getByText("Is Authenticated: No")).toBeInTheDocument();
    expect(localStorage.getItem("auth")).toBeNull();
    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  test("throws error when useAuth is used outside of AuthProvider", () => {
    const consoleError = console.error;
    console.error = jest.fn(); // Suppress expected error message

    expect(() => render(<TestComponent />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );

    console.error = consoleError; // Restore console error
  });

  test("loads auth data from localStorage on initialization", () => {
    localStorage.setItem("auth", JSON.stringify(testAuthData));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByText(`Auth: ${testAuthData.username}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Is Authenticated: Yes")).toBeInTheDocument();
  });

  test("ensures window is defined for localStorage access", () => {
    // Mock the window object
    const originalWindow = global.window;
    global.window = {} as any;

    localStorage.setItem("auth", JSON.stringify(testAuthData));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByText(`Auth: ${testAuthData.username}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Is Authenticated: Yes")).toBeInTheDocument();

    // Restore the original window object
    global.window = originalWindow;
  });

  test("ensures window is defined for localStorage access", () => {
    // Mock the window object
    const originalWindow = global.window;
    global.window = {} as any;

    localStorage.setItem("auth", JSON.stringify(testAuthData));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByText(`Auth: ${testAuthData.username}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Is Authenticated: Yes")).toBeInTheDocument();

    // Restore the original window object
    global.window = originalWindow;
  });
});
