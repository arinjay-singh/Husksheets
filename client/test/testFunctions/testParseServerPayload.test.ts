/**
 * @file parse-server-payload.test.ts
 * @brief Tests for the parseServerPayload function and related utilities
 * @version 1.0
 * @date 06-04-2024
 * @author Troy Caron
 */

import {
    parseLatestUpdates,
    convertToPayload,
    formatChanges
  } from "../../src/functions/parse-payload"; // Adjust the import path
  
describe("parse-payload", () => {
  test('should correctly parse payload given into a JSON array of objects', () => {
    // should correctly assign values to the correct cell
    const payload1 = "$A1 12.0\n$A2 \"Monkey\"\n$B1 Hello\n$B2 =($A1 + 12.0)\n";
    expect(parseLatestUpdates(payload1)).toEqual([
      ["12.0", "Hello"],
      ["\"Monkey\"", "=($A1 + 12.0)"]
    ]);

    // should correctly assign an empty cell
    const payloadwithEmptyCell = "$A1 12.0\n$A2 \"Monkey\"\n$B1 Hello\n$B2 \n";
    expect(parseLatestUpdates(payloadwithEmptyCell)).toEqual([
      ["12.0", "Hello"],
      ["\"Monkey\"", ""]
    ]);

    // should correctly assign an empty payload
    const emptyPayload = "$A1 \n$A2 \n$B1 \n$B2 \n";
    expect(parseLatestUpdates(emptyPayload)).toEqual([
      ["", ""],
      ["", ""]
    ]);

    // should correctly overwrite values to the correct cells and, since there was never
    // a value specified for $B2, it should be an empty string
    const payload2 = "$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n".repeat(20);
    expect(parseLatestUpdates(payload2)).toEqual([
      ["12.0", "=($A1 + 12.0)"],
      ["\"Monkey\"", ""]
    ]);
  });

  test('should correctly handle missing ref in payload line', () => {
    const payloadWithMissingRef = " 12.0\n$A2 \"Monkey\"\n";
    expect(parseLatestUpdates(payloadWithMissingRef)).toEqual([
      [""],
      ["\"Monkey\""]
    ]);
  });
});

describe("convertToPayload", () => {
  test('should correctly convert a 2D array back into a server payload', () => {
    // normal test case
    const payload1 = "$A1 12.0\n$B1 Hello\n$A2 \"Monkey\"\n$B2 =($A1 + 12.0)\n";
    expect(convertToPayload([["12.0", "Hello"], ["\"Monkey\"", "=($A1 + 12.0)"]])).toEqual(payload1);

    // test case with empty 2x2 array
    const emptyPayload = "$A1 \n$B1 \n$A2 \n$B2 \n";
    expect(convertToPayload([["", ""], ["", ""]])).toEqual(emptyPayload);

    // test case with one cell empty in 2x2 array
    const partiallyEmptyPayload = "$A1 12.0\n$B1 Hello\n$A2 \"Monkey\"\n$B2 \n";
    expect(convertToPayload([["12.0", "Hello"], ["\"Monkey\"", ""]])).toEqual(partiallyEmptyPayload);
  });

  test('should skip null values in data array', () => {
    const dataWithNull = [["12.0", null], ["\"Monkey\"", "=($A1 + 12.0)"]];
    const expectedPayload = "$A1 12.0\n$A2 \"Monkey\"\n$B2 =($A1 + 12.0)\n";
    expect(convertToPayload(dataWithNull as unknown as string[][])).toEqual(expectedPayload);
  });
});

describe("formatChanges", () => {
    test('should correctly format changes as a payload string', () => {
      const changes = [
        { row: 0, col: 0, value: "12.0" },
        { row: 0, col: 1, value: "Hello" },
        { row: 1, col: 0, value: "\"Monkey\"" },
        { row: 1, col: 1, value: "=($A1 + 12.0)" }
      ];
      const expectedPayload = "$A1 12.0\n$B1 Hello\n$A2 \"Monkey\"\n$B2 =($A1 + 12.0)";
      expect(formatChanges(changes)).toEqual(expectedPayload);
    });
  
    test('should correctly handle empty changes', () => {
      const changes = [
        { row: 0, col: 0, value: "" },
        { row: 1, col: 1, value: "" }
      ];
      const expectedPayload = "$A1 \n$B2 ";
      expect(formatChanges(changes)).toEqual(expectedPayload);
    });
  
    test('should correctly handle multiple rows and columns', () => {
      const changes = [
        { row: 0, col: 0, value: "1" },
        { row: 0, col: 1, value: "2" },
        { row: 0, col: 2, value: "3" },
        { row: 1, col: 0, value: "4" },
        { row: 1, col: 1, value: "5" },
        { row: 1, col: 2, value: "6" }
      ];
      const expectedPayload = "$A1 1\n$B1 2\n$C1 3\n$A2 4\n$B2 5\n$C2 6";
      expect(formatChanges(changes)).toEqual(expectedPayload);
    });
  });
