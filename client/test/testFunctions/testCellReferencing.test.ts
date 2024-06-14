/**
 * @file testCellReferencing.test.ts
 * @brief Tests for the cell-referencing functionality
 * @version 1.0
 * @author Nicholas O'Sullivan
 */


import { retrieveCellValue } from "../../src/functions/cell-referencing";

describe("retrieveCellValue", () => {
  it("should retrieve cell value correctly from data", () => {
    const data = [
      ["A1", "B1", "C1"],
      ["A2", "B2", "C2"],
      ["A3", "B3", "C3"]
    ];

    // Test retrieval for known coordinates
    expect(retrieveCellValue(data, [0, 0])).toEqual("A1");
    expect(retrieveCellValue(data, [1, 1])).toEqual("B2");
    expect(retrieveCellValue(data, [2, 2])).toEqual("C3");
  });

});

import { parseCellReferences } from "../../src/functions/cell-referencing";

describe("parseCellReferences", () => {
  const data = [
    ["A1", "B1"],
    ["A2", "B2"]
  ];

  it("should replace cell references with values from data", () => {
    const expression = "= $A1 + $B2";
    const parsed = parseCellReferences(data, expression);
    expect(parsed).toEqual("= A1 + B2");
  });

  it("should handle invalid cell references", () => {
    const expression = "= $A1 + $C3"; // C3 is out of bounds in the mock data
    const parsed = parseCellReferences(data, expression);
    expect(parsed).toEqual("= A1 + $C3"); // Invalid reference remains unchanged
  });
});


import { retrieveCellRangeValues } from "../../src/functions/cell-referencing";

describe("retrieveCellRangeValues", () => {
  const data = [
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"],
    ["A3", "B3", "C3"]
  ];

  it("should retrieve values from cell range", () => {
    const rangeValues = retrieveCellRangeValues("$A1", "$B2", data);
    expect(rangeValues).toEqual("A1,B1,A2,B2");
  });

  it("should handle invalid cell ranges gracefully", () => {
    // Mock data does not cover all possible scenarios, but test edge cases
    const rangeValues = retrieveCellRangeValues("$A1", "$D4", data);
    expect(rangeValues).toEqual(""); // Invalid range should return empty string
  });
});


import { replaceCellRangesWithValues } from "../../src/functions/cell-referencing";

describe("replaceCellRangesWithValues", () => {
  const data = [
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"],
    ["A3", "B3", "C3"]
  ];

  it("should replace cell range with values from data", () => {
    const input = "= SUM($A1:$B2)";
    const result = replaceCellRangesWithValues(data, input);
    expect(result).toEqual("= SUM(A1,B1,A2,B2)");
  });

  it("should handle invalid cell ranges gracefully", () => {
    const input = "= SUM($A1:$D4)";
    const result = replaceCellRangesWithValues(data, input);
    expect(result).toEqual("= SUM()");
  });
});


import { cellMap } from "../../src/functions/cell-referencing";


describe("cellMap", () => {
  it("should convert cell reference to row and column indices", () => {
    expect(cellMap("A1")).toEqual([0, 0]);
    expect(cellMap("B2")).toEqual([1, 1]);
    expect(cellMap("Z1")).toEqual([0, 25]);
    expect(cellMap("AA1")).toEqual([0, 26]);
    expect(cellMap("AB10")).toEqual([9, 27]);
  });

  it("should handle cell references with no letter part", () => {

    // Expect column to be -1 as there's no letter part
    expect(cellMap("1")).toEqual([0, -1]); 

    // Expect column to be -1 as there's no letter part
    expect(cellMap("10")).toEqual([9, -1]); 

  });

  it("should handle cell references with no number part", () => {

    // Expect row to be -1 as there's no number part
    expect(cellMap("A")).toEqual([-1, 0]); 

    // Expect row to be -1 as there's no number part
    expect(cellMap("Z")).toEqual([-1, 25]); 

  });

  it("should handle invalid cell references", () => {

    // Both row and column should be -1 for empty input
    expect(cellMap("")).toEqual([-1, -1]); 

    // Both row and column should be -1 for whitespace input
    expect(cellMap(" ")).toEqual([-1, -1]); 

    // Both row and column should be -1 for special character input
    expect(cellMap("!@#")).toEqual([-1, -1]); 
    
  });
});
