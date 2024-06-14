/**
 * @file parse-server-payload.ts
 * @brief A function to parse server payload into a 2D array format.
 * @version 1.0
 * @date 06-04-2024
 * @author Troy M. Caron
 */


import { cellMap } from "../../src/functions/cell-referencing";

// Function to parse the server payload and convert it to a 2D array
export const parseServerPayload = (payload: string[]): (string)[][] => {
    if (payload.length === 0) {
    return [];
    }
    console.log(payload);

    // Join the array into a single string and then split it into lines
    const payloadStr = payload.join('');
    const lines = payloadStr.split('\n');
    let maxRow = 0;
    let maxCol = 0;
    const parsedPayload: { row: number, col: number, value: string }[] = [];
    for (const line of lines) {
        if (line.trim()) { // Check if the line is not empty
            const [ref, ...termParts] = line.split(' ');
            const term = termParts.join(' ') || ""; // Ensure empty cells are represented as empty strings
            if (ref) { // Ensure ref is defined
                const [row, col] = cellMap(ref);
                parsedPayload.push({ row, col, value: term });
                if (row > maxRow) maxRow = row;
                if (col > maxCol) maxCol = col;
            }
        }
    }

    // Create a 2D array filled with nulls
    const result: (string)[][] = Array.from({ length: maxRow + 1 }, () => Array(maxCol + 1).fill(""));
    // Fill the 2D array with parsed values
    for (const { row, col, value } of parsedPayload) {
        result[row][col] = value;
    }
    console.log("result", result);
    if (result == null) {
        return [];
    } else {
        return result;
    }
};

export const parseLatestUpdates = (payload: string): (string)[][] => {
    // if (payload.length === 0) {
    // return [];
    // }
    // console.log(payload);
    //
    // // Join the array into a single string and then split it into lines
    // const payloadStr = payload.join('');
    const lines = payload.split('\n');
    let maxRow = 0;
    let maxCol = 0;
    const parsedPayload: { row: number, col: number, value: string }[] = [];
    for (const line of lines) {
        if (line.trim()) { // Check if the line is not empty
            const [ref, ...termParts] = line.split(' ');
            const term = termParts.join(' ') || ""; // Ensure empty cells are represented as empty strings
            if (ref) { // Ensure ref is defined
                const [row, col] = cellMap(ref);
                parsedPayload.push({ row, col, value: term });
                if (row > maxRow) maxRow = row;
                if (col > maxCol) maxCol = col;
            }
        }
    }

    // Create a 2D array filled with nulls
    const result: (string)[][] = Array.from({ length: maxRow + 1 }, () => Array(maxCol + 1).fill(""));
    // Fill the 2D array with parsed values
    for (const { row, col, value } of parsedPayload) {
        result[row][col] = value;
    }
    console.log("result", result);
    if (result == null) {
        return [];
    } else {
        return result;
    }
};

// Function to convert a 2D array back into a server payload
export const convertToPayload = (data: string[][]): string => {
    const payloadLines: string[] = [];

    for (let row = 0; row < data.length; row++) {
        for (let col = 0; col < data[row].length; col++) {
            const value = data[row][col];
            if (value !== null) {
                const cellRef = getCellReference(row, col);
                payloadLines.push(`${cellRef} ${value}`);
            }
        }
    }

    return payloadLines.join('\n') + '\n';
};

// Utility function to convert column index to letter (e.g., 0 -> 'A', 1 -> 'B')
const getColumnLetter = (colIndex: number): string => {
  let letter = "";
  while (colIndex >= 0) {
    letter = String.fromCharCode((colIndex % 26) + 65) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
};

// Utility function to format cell address
const getCellAddress = (rowIndex: number, colIndex: number): string => {
  const columnLetter = getColumnLetter(colIndex);
  return `$${columnLetter}${rowIndex + 1}`;
};

export const formatChanges = (changes: { row: number; col: number; value: string }[]) => {
  return changes.map(change => {
    const cellAddress = getCellAddress(change.row, change.col);
    return `${cellAddress} ${`${change.value}`}`;
  }).join('\n');
};



// Function to convert a 0-indexed row and column to a cell reference
const getCellReference = (row: number, col: number): string => {
    const columnReference = getColumnLetters(col);
    const rowReference = (row + 1).toString();
    return `$${columnReference}${rowReference}`;
};

// Function to convert column index to column letters
const getColumnLetters = (col: number): string => {
    let columnReference = '';
    let colIndex = col;

    while (colIndex >= 0) {
        columnReference = String.fromCharCode((colIndex % 26) + 65) + columnReference;
        colIndex = Math.floor(colIndex / 26) - 1;
    }

    return columnReference;
};