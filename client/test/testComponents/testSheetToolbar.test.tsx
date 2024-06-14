/**
 * @file sheet-toolbar.test.tsx
 * @brief Tests for the SheetToolbar component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SheetToolbar from "../../src/components/sheet-toolbar"; // Adjust the import path
import SheetInputField from "../../src/components/sheet-input-field"; // Adjust the import path
import ConditionalSelectField from "../../src/components/sheet-select-field"; // Adjust the import path

jest.mock("../../src/components/sheet-input-field");
jest.mock("../../src/components/sheet-select-field");

describe("SheetToolbar", () => {
  const mockSetTextValue = jest.fn();
  const mockSetPublisher = jest.fn();
  const mockSetSelectedSheet = jest.fn();
  const mockHandleGetPublishers = jest.fn().mockResolvedValue(null);
  const mockHandleGetSheets = jest.fn().mockResolvedValue(null);
  const buttons = [
    { func: jest.fn(), color: "red", label: "Button1" },
    { func: jest.fn(), color: "blue", label: "Button2" },
  ];
  const textFieldProps = {
    textValue: "Test Sheet",
    setTextValue: mockSetTextValue,
    buttons: buttons,
  };
  const dropdownProps = [
    {
      onClick: mockHandleGetPublishers,
      value: "Publisher1",
      setValue: mockSetPublisher,
      values: ["Publisher1", "Publisher2"],
      label: "Publisher",
    },
    {
      onClick: mockHandleGetSheets,
      value: "Sheet1",
      setValue: mockSetSelectedSheet,
      values: ["Sheet1", "Sheet2"],
      label: "Sheet",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (SheetInputField as jest.Mock).mockImplementation(
      ({ textValue, setTextValue, buttons }) => (
        <div>
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          {buttons.map(
            (button: { func: () => void; color: string; label: string }) => (
              <button
                key={button.label}
                onClick={button.func}
                style={{ backgroundColor: button.color }}
              >
                {button.label}
              </button>
            )
          )}
        </div>
      )
    );

    (ConditionalSelectField as jest.Mock).mockImplementation(
      ({ onClick, value, setValue, values, label }) => (
        <div>
          <button onClick={onClick}>{label}</button>
          <select value={value} onChange={(e) => setValue(e.target.value)}>
            {values.map((val: string) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      )
    );
  });

  test("renders SheetInputField and ConditionalSelectFields with correct props", () => {
    render(
      <SheetToolbar
        textFieldProps={textFieldProps}
        dropdownProps={dropdownProps}
      />
    );

    // Check if the input field is rendered with the correct value
    const input = screen.getByDisplayValue("Test Sheet");
    expect(input).toBeInTheDocument();

    // Check if the buttons are rendered
    buttons.forEach((button) => {
      expect(screen.getByText(button.label)).toBeInTheDocument();
    });

    // Check if the dropdowns are rendered with the correct values
    expect(screen.getByText("Publisher")).toBeInTheDocument();
    expect(screen.getByText("Sheet")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Publisher1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sheet1")).toBeInTheDocument();
  });

  test("calls setTextValue when input value changes", () => {
    render(
      <SheetToolbar
        textFieldProps={textFieldProps}
        dropdownProps={dropdownProps}
      />
    );

    // Change the value of the input field
    const input = screen.getByDisplayValue("Test Sheet");
    fireEvent.change(input, { target: { value: "New Sheet Name" } });
    expect(mockSetTextValue).toHaveBeenCalledWith("New Sheet Name");
  });

  test("calls button functions when buttons are clicked", () => {
    render(
      <SheetToolbar
        textFieldProps={textFieldProps}
        dropdownProps={dropdownProps}
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

  test("calls setValue when dropdown value changes", () => {
    render(
      <SheetToolbar
        textFieldProps={textFieldProps}
        dropdownProps={dropdownProps}
      />
    );

    // Change the value of the first dropdown
    const publisherDropdown = screen.getByDisplayValue("Publisher1");
    fireEvent.change(publisherDropdown, { target: { value: "Publisher2" } });
    expect(mockSetPublisher).toHaveBeenCalledWith("Publisher2");

    // Change the value of the second dropdown
    const sheetDropdown = screen.getByDisplayValue("Sheet1");
    fireEvent.change(sheetDropdown, { target: { value: "Sheet2" } });
    expect(mockSetSelectedSheet).toHaveBeenCalledWith("Sheet2");
  });

  test("calls onClick when dropdown buttons are clicked", () => {
    render(
      <SheetToolbar
        textFieldProps={textFieldProps}
        dropdownProps={dropdownProps}
      />
    );

    // Click the first dropdown button
    const publisherButton = screen.getByText("Publisher");
    fireEvent.click(publisherButton);
    expect(mockHandleGetPublishers).toHaveBeenCalled();

    // Click the second dropdown button
    const sheetButton = screen.getByText("Sheet");
    fireEvent.click(sheetButton);
    expect(mockHandleGetSheets).toHaveBeenCalled();
  });
});
