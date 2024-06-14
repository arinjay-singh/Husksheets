/**
 * @file toolbar-button.test.tsx
 * @brief Tests for the ToolBarButton component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToolBarButton } from "../../src/components/toolbar-button"; // Adjust the import path

describe("ToolBarButton", () => {
  const mockOnClick = jest.fn();
  const buttonLabel = "Click Me";
  const buttonColor = "blue";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the button with correct label and color", () => {
    render(
      <ToolBarButton onClick={mockOnClick} color={buttonColor}>
        {buttonLabel}
      </ToolBarButton>
    );

    // Check if the button is rendered with the correct label
    const button = screen.getByText(buttonLabel);
    expect(button).toBeInTheDocument();

    // Check if the button has the correct color class
    expect(button).toHaveClass(`bg-${buttonColor}-500`);
  });

  test("calls onClick when the button is clicked", () => {
    render(
      <ToolBarButton onClick={mockOnClick} color={buttonColor}>
        {buttonLabel}
      </ToolBarButton>
    );

    // Click the button
    const button = screen.getByText(buttonLabel);
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
