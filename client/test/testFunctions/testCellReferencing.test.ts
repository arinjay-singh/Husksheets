/**
 * @file testParseServerPayload.test.ts
 * @brief Tests for the parseServerPayload function
 * @version 1.0
 * @date 06-04-2024
 * @author Troy Caron
 */

import { cellMap } from "../../src/functionality/cell-referencing";


describe("cellMap", () => {
     test('should correctly map cells from a 2d array to their corresponding reference', () => {
        expect(cellMap("$A1")).toEqual([0, 0]);
        expect(cellMap("$B2")).toEqual([1, 1]);
        expect(cellMap("$C3")).toEqual([2, 2]);
        expect(cellMap("$Z1")).toEqual([0, 25]);
        expect(cellMap("$AA1")).toEqual([0, 26]);
        expect(cellMap("$AB2")).toEqual([1, 27]);
    });

    test('should handle lower-case letters correctly', () => {
        expect(cellMap("$a1")).toEqual([0, 0]);
        expect(cellMap("$b2")).toEqual([1, 1]);
        expect(cellMap("$aa1")).toEqual([0, 26]);
        expect(cellMap("$ab2")).toEqual([1, 27]);
    });
});