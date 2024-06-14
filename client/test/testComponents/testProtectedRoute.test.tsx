/**
 * @file protected-route.test.tsx
 * @brief Tests for the ProtectedRoute component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "../../src/components/protected-route"; // Adjust the import path
import { useAuth } from "../../src/context/auth-context"; // Adjust the import path
import { useRouter, usePathname } from "next/navigation";

jest.mock("../../src/context/auth-context");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));
jest.mock("../../src/components/loading", () => ({
  Loading: () => <div>Loading...</div>,
}));

describe("ProtectedRoute", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  test("renders loading component when loading is true", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: jest.fn(() => false),
      auth: {},
      loading: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("redirects to login page when not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: jest.fn(() => false),
      auth: {},
      loading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  test("renders children when authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: jest.fn(() => true),
      auth: {},
      loading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
