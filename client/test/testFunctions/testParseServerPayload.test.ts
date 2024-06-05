/**
 * @file testParseServerPayload.test.ts
 * @brief Tests for the parseServerPayload function
 * @version 1.0
 * @date 06-04-2024
 * @author Troy Caron
 */

import { parseServerPayload } from "../../src/functions/parse-payload";

describe("parse-payload", () => {
    test('should correctly parse payload given into a JSON array of objects', () => {

        // should correctly assign values to the correct cell
        const payload1 = "$A1 12.0\n$A2 \"Monkey\"\n$B1 Hello\n$B2 =($A1 + 12.0)\n";
        expect(parseServerPayload(payload1)).toEqual([["12.0", "Hello"], ["\"Monkey\"", "=($A1 + 12.0)"]]);

        // should correctly overwrite values to the correct cells
        const payload2 = "$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n$A1 12.0\n$A2 \"Monkey\"\n$B1 =($A1 + 12.0)\n";
        expect(parseServerPayload(payload2)).toEqual([["12.0", "=($A1 + 12.0)"], ["\"Monkey\"", null]]);
    });


});