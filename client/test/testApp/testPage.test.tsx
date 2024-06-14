/**
 * @file page.test.tsx
 * @brief Tests for the Home component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../../src/app/page"; // Adjust the import path
import { useAuth } from "@/context/auth-context";
import { useRegister } from "@/app/api/api/register";
import { ProtectedRoute } from "@/components/protected-route";
import { ToolBarButton } from "@/components/toolbar-button";
import Spreadsheet from "@/components/spreadsheet";

// Mock dependencies
jest.mock("@/context/auth-context", () => ({
  useAuth: jest.fn(),
}));
jest.mock("@/app/api/api/register", () => ({
  useRegister: jest.fn(),
}));
jest.mock("@/components/protected-route", () => ({
  ProtectedRoute: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock("@/components/toolbar-button", () => ({
  ToolBarButton: jest.fn(({ children, onClick, color }) => (
    <button onClick={onClick} className={`bg-${color}-500 text-white`}>
      {children}
    </button>
  )),
}));
jest.mock("@/components/spreadsheet", () =>
  jest.fn(() => <div>Mock Spreadsheet</div>)
);

describe("Home", () => {
  const mockLogout = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useRegister as jest.Mock).mockReturnValue({ register: mockRegister });
  });

  test("renders Home component with ProtectedRoute, ToolBarButtons, and Spreadsheet", () => {
    render(<Home />);

    // Check if ProtectedRoute is rendered
    expect(ProtectedRoute).toHaveBeenCalled();

    // Check if ToolBarButtons are rendered
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();

    // Check if Spreadsheet component is rendered
    expect(screen.getByText("Mock Spreadsheet")).toBeInTheDocument();
  });

  test("calls logout function when Logout button is clicked", () => {
    render(<Home />);

    // Click the Logout button
    fireEvent.click(screen.getByText("Logout"));

    // Verify that the logout function is called
    expect(mockLogout).toHaveBeenCalled();
  });

  test("calls register function when Register button is clicked", () => {
    render(<Home />);

    // Click the Register button
    fireEvent.click(screen.getByText("Register"));

    // Verify that the register function is called
    expect(mockRegister).toHaveBeenCalled();
  });

  test("renders the title correctly", () => {
    render(<Home />);

    // Check if the title is rendered
    expect(screen.getByText("HuskSheets")).toBeInTheDocument();
  });
});
