/**
 * @file parse-server-payload.ts
 * @brief A function to parse server payload into a 2D array format.
 * @version 1.0
 * @date 06-04-2024
 * @author Troy M. Caron
 */


import { cellMap } from "../../src/functions/cell-referencing";

// Function to parse the server payload and convert it to a 2D array
export const parseServerPayload = (payload: string): (string | null)[][] => {
    const lines = payload.split('\n');
    let maxRow = 0;
    let maxCol = 0;
    const parsedPayload: { row: number, col: number, value: string }[] = [];

    for (const line of lines) {
        if (line.trim()) { // Check if the line is not empty
            const [ref, ...termParts] = line.split(' ');
            const term = termParts.join(' ');
            if (ref && term) { // Ensure both ref and term are defined
                const [row, col] = cellMap(ref);
                parsedPayload.push({ row, col, value: term });
                if (row > maxRow) maxRow = row;
                if (col > maxCol) maxCol = col;
            }
        }
    }

    // Create a 2D array filled with nulls
    const result: (string | null)[][] = Array.from({ length: maxRow + 1 }, () => Array(maxCol + 1).fill(null));

    // Fill the 2D array with parsed values
    for (const { row, col, value } of parsedPayload) {
        result[row][col] = value;
    }

    return result;
};
