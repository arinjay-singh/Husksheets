/**
 * @file sheet-select-field.test.tsx
 * @brief Tests for the ConditionalSelectField component
 * @date 06-13-2024
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConditionalSelectField from "../../src/components/sheet-select-field"; // Adjust the import path
import { ToolBarButton } from "../../src/components/toolbar-button"; // Adjust the import path
import ConditionalDropdown from "../../src/components/conditional-dropdown"; // Adjust the import path

jest.mock("../../src/components/toolbar-button");
jest.mock("../../src/components/conditional-dropdown");

describe("ConditionalSelectField", () => {
  const mockOnClick = jest.fn();
  const mockSetValue = jest.fn();
  const values = ["Option1", "Option2", "Option3"];
  const label = "Select Sheet";

  beforeEach(() => {
    jest.clearAllMocks();

    (ToolBarButton as jest.Mock).mockImplementation(({ onClick, children }) => (
      <button onClick={onClick}>{children}</button>
    ));

    (ConditionalDropdown as jest.Mock).mockImplementation(
      ({ value, setValue, values }) => (
        <select value={value} onChange={(e) => setValue(e.target.value)}>
          <option>None</option>
          {values.map((val: string) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      )
    );
  });

  test("renders the button and dropdown", () => {
    render(
      <ConditionalSelectField
        onClick={mockOnClick}
        value="Option1"
        setValue={mockSetValue}
        values={values}
        label={label}
      />
    );

    // Check if the button is rendered with the correct label
    expect(screen.getByText(label)).toBeInTheDocument();

    // Check if the dropdown is rendered with the correct value
    const dropdown = screen.getByDisplayValue("Option1");
    expect(dropdown).toBeInTheDocument();
  });

  test("calls onClick when the button is clicked", () => {
    render(
      <ConditionalSelectField
        onClick={mockOnClick}
        value="Option1"
        setValue={mockSetValue}
        values={values}
        label={label}
      />
    );

    // Click the button
    const button = screen.getByText(label);
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });

  test("calls setValue when a new option is selected", () => {
    render(
      <ConditionalSelectField
        onClick={mockOnClick}
        value="Option1"
        setValue={mockSetValue}
        values={values}
        label={label}
      />
    );

    // Change the dropdown value
    const dropdown = screen.getByDisplayValue("Option1");
    fireEvent.change(dropdown, { target: { value: "Option2" } });
    expect(mockSetValue).toHaveBeenCalledWith("Option2");
  });

  test("renders the correct options in the dropdown", () => {
    render(
      <ConditionalSelectField
        onClick={mockOnClick}
        value="Option1"
        setValue={mockSetValue}
        values={values}
        label={label}
      />
    );

    // Check if the correct options are rendered in the dropdown
    values.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });
});
