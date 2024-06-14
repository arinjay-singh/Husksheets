/**
 * @file conditional-dropdown.test.tsx
 * @brief Tests for the ConditionalDropdown component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConditionalDropdown from "../../src/components/conditional-dropdown"; // Adjust the import path

describe("ConditionalDropdown", () => {
  const mockSetValue = jest.fn();
  const values = ["Option1", "Option2", "Option3"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls setValue when a new option is selected", () => {
    render(
      <ConditionalDropdown
        value="Option1"
        setValue={mockSetValue}
        values={values}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Option2" },
    });
    expect(mockSetValue).toHaveBeenCalledWith("Option2");
  });

  test("renders the correct options in the dropdown", () => {
    render(
      <ConditionalDropdown
        value="Option1"
        setValue={mockSetValue}
        values={values}
      />
    );

    values.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });
});
