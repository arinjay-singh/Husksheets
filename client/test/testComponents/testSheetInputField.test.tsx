/**
 * @file sheet-input-field.test.tsx
 * @brief Tests for the SheetInputField component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SheetInputField from "../../src/components/sheet-input-field"; // Adjust the import path
import ButtonRow from "../../src/components/button-row"; // Adjust the import path

jest.mock("../../src/components/button-row");

describe("SheetInputField", () => {
  const mockSetTextValue = jest.fn();
  const buttons = [
    { func: jest.fn(), color: "red", label: "Button1" },
    { func: jest.fn(), color: "blue", label: "Button2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (ButtonRow as jest.Mock).mockImplementation(({ buttons }) => (
      <div>
        {buttons.map(
          (button: { func: () => void; color: string; label: string }) => (
            <button
              key={button.label}
              style={{ backgroundColor: button.color }}
              onClick={button.func}
            >
              {button.label}
            </button>
          )
        )}
      </div>
    ));
  });

  test("renders the input field and buttons", () => {
    render(
      <SheetInputField
        textValue="Test Sheet"
        setTextValue={mockSetTextValue}
        buttons={buttons}
      />
    );

    // Check if the input field is rendered with the correct value
    const input = screen.getByPlaceholderText("Sheet Name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Test Sheet");

    // Check if the buttons are rendered
    buttons.forEach((button) => {
      expect(screen.getByText(button.label)).toBeInTheDocument();
    });
  });

  test("calls setTextValue when input value changes", () => {
    render(
      <SheetInputField
        textValue="Test Sheet"
        setTextValue={mockSetTextValue}
        buttons={buttons}
      />
    );

    // Change the input value
    const input = screen.getByPlaceholderText("Sheet Name");
    fireEvent.change(input, { target: { value: "New Sheet" } });
    expect(mockSetTextValue).toHaveBeenCalledWith("New Sheet");
  });

  test("button click calls the correct function", () => {
    render(
      <SheetInputField
        textValue="Test Sheet"
        setTextValue={mockSetTextValue}
        buttons={buttons}
      />
    );

    // Click the first button
    const button1 = screen.getByText("Button1");
    fireEvent.click(button1);
    expect(buttons[0].func).toHaveBeenCalled();

    // Click the second button
    const button2 = screen.getByText("Button2");
    fireEvent.click(button2);
    expect(buttons[1].func).toHaveBeenCalled();
  });
});
