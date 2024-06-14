/**
 * @file testParseServerPayload.test.ts
 * @brief Tests for the parseServerPayload function
 * @version 1.0
 * @date 06-04-2024
 * @author Troy Caron
 */

import { parseServerPayload, convertToPayload } from "../../src/functionality/parse-payload";

describe("parse-payload", () => {
    test('should correctly parse payload given into a JSON array of objects', () => {

        // should correctly assign values to the correct cell
        const payload1 = "$A1 12.0\n$A2 \"Monkey\"\n$B1 Hello\n$B2 =($A1 + 12.0)\n";
        expect(parseServerPayload(payload1)).toEqual([["12.0", "Hello"], 
                                                      ["\"Monkey\"", "=($A1 + 12.0)"]]);

        // should correctly assign an empty cell
        const payloadwithEmptyCell = "$A1 12.0\n$A2 \"Monkey\"\n$B1 Hello\n$B2 \n";
        expect(parseServerPayload(payloadwithEmptyCell)).toEqual([["12.0", "Hello"], 
                                                                  ["\"Monkey\"", ""]]);

        // should correctly assign an empty payload
        const emptyPayload = "$A1 \n$A2 \n$B1 \n$B2 \n";
        expect(parseServerPayload(emptyPayload)).toEqual([["", ""],
                                                          ["", ""]]);

        // should correctly overwrite values to the correct cells and, since there was never
        // a value specified for $B2, it should be an empty string
        const payload2 = "$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n";
        expect(parseServerPayload(payload2)).toEqual([["12.0", "=($A1 + 12.0)"], 
                                                      ["\"Monkey\"", ""]]);
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


});