/**
 * @file loading.test.tsx
 * @brief Tests for the Loading component
 * @date 06-13-2024
 * @author Troy Caron
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { Loading } from "../../src/components/loading"; // Adjust the import path

describe("Loading", () => {
  test("renders the loading component", () => {
    render(<Loading />);

    // Check if the loader div is present
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders the loader and loading text", () => {
    render(<Loading />);

    // Check if the loader div is present by its class name
    expect(document.querySelector(".loader")).toBeInTheDocument();

    // Check if the loading text is present
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
