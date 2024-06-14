/**
 * @file button-row.test.tsx
 * @brief Tests for the ButtonRow component
 * @date 06-13-2024
 * @author Troy Caron
 */

import { render, screen, fireEvent } from "@testing-library/react";
import ButtonRow from "../../src/components/button-row"; // Adjust the import path
import { ToolBarButton } from "../../src/components/toolbar-button"; // Adjust the import path

jest.mock("../../src/components/toolbar-button");

describe("ButtonRow", () => {
  const mockFunc1 = jest.fn();
  const mockFunc2 = jest.fn();
  const buttons = [
    { func: mockFunc1, color: "red", label: "Button1" },
    { func: mockFunc2, color: "blue", label: "Button2" },
  ];

  beforeEach(() => {
    (ToolBarButton as jest.Mock).mockImplementation(
      ({ onClick, color, children }) => (
        <button style={{ backgroundColor: color }} onClick={onClick}>
          {children}
        </button>
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the buttons correctly", () => {
    render(<ButtonRow buttons={buttons} />);
    expect(screen.getByText("Button1")).toBeInTheDocument();
    expect(screen.getByText("Button2")).toBeInTheDocument();
  });

  test("calls the correct function when a button is clicked", () => {
    render(<ButtonRow buttons={buttons} />);
    fireEvent.click(screen.getByText("Button1"));
    fireEvent.click(screen.getByText("Button2"));
    expect(mockFunc1).toHaveBeenCalled();
    expect(mockFunc2).toHaveBeenCalled();
  });

  test("applies the correct colors to the buttons", () => {
    render(<ButtonRow buttons={buttons} />);
    expect(screen.getByText("Button1")).toHaveStyle({ backgroundColor: "red" });
    expect(screen.getByText("Button2")).toHaveStyle({
      backgroundColor: "blue",
    });
  });
});
