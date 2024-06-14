/**
 * @file sheet-table.test.tsx
 * @brief Tests for the SheetTable component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SheetTable from "../../src/components/sheet-table"; // Adjust the import path

describe("SheetTable", () => {
  const mockAddRow = jest.fn();
  const mockAddColumn = jest.fn();
  const mockOnChange = jest.fn();
  const mockOnExecute = jest.fn();
  const data = [
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"],
    ["A3", "B3", "C3"],
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the table with correct data", () => {
    render(
      <SheetTable
        data={data}
        addRow={mockAddRow}
        addColumn={mockAddColumn}
        onChange={mockOnChange}
        onExecute={mockOnExecute}
      />
    );

    // Check if the table headers are rendered correctly
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();

    // Check if the table cells are rendered correctly
    data.forEach((row) => {
      row.forEach((cell) => {
        expect(screen.getByDisplayValue(cell)).toBeInTheDocument();
      });
    });
  });

  test("calls onChange when input value changes", () => {
    render(
      <SheetTable
        data={data}
        addRow={mockAddRow}
        addColumn={mockAddColumn}
        onChange={mockOnChange}
        onExecute={mockOnExecute}
      />
    );

    // Change the value of the first cell
    const input = screen.getByDisplayValue("A1");
    fireEvent.change(input, { target: { value: "A1-changed" } });
    expect(mockOnChange).toHaveBeenCalledWith(0, 0, "A1-changed");
  });

  test("calls onExecute when Enter key is pressed", () => {
    render(
      <SheetTable
        data={data}
        addRow={mockAddRow}
        addColumn={mockAddColumn}
        onChange={mockOnChange}
        onExecute={mockOnExecute}
      />
    );

    // Press Enter in the first cell
    const input = screen.getByDisplayValue("A1");
    fireEvent.keyDown(input, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
      keyCode: 13,
    });
    expect(mockOnExecute).toHaveBeenCalledWith(0, 0, "A1");
  });

  test("calls addRow when add row button is clicked", () => {
    render(
      <SheetTable
        data={data}
        addRow={mockAddRow}
        addColumn={mockAddColumn}
        onChange={mockOnChange}
        onExecute={mockOnExecute}
      />
    );

    // Click the add row button
    const addRowButton = screen.getAllByText("+")[1];
    fireEvent.click(addRowButton);
    expect(mockAddRow).toHaveBeenCalled();
  });

  test("calls addColumn when add column button is clicked", () => {
    render(
      <SheetTable
        data={data}
        addRow={mockAddRow}
        addColumn={mockAddColumn}
        onChange={mockOnChange}
        onExecute={mockOnExecute}
      />
    );

    // Click the add column button
    const addColumnButton = screen.getAllByText("+")[0];
    fireEvent.click(addColumnButton);
    expect(mockAddColumn).toHaveBeenCalled();
  });

  test("executes action on Enter key press", () => {
    render(
      <SheetTable
        data={data}
        addRow={mockAddRow}
        addColumn={mockAddColumn}
        onChange={mockOnChange}
        onExecute={mockOnExecute}
      />
    );

    // Find an input field and press Enter
    const input = screen.getByDisplayValue("A1");
    fireEvent.keyDown(input, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
      keyCode: 13,
    });

    expect(mockOnExecute).toHaveBeenCalledWith(0, 0, "A1");
  });
});
