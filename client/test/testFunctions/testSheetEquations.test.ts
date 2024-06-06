/**
 * @file testSheetEquations.test.ts
 * @brief Tests for the parseEquation and parseFunction functions
 * @version 1.0
 * @date 06-06-2024
 * @author Troy Caron
 */

import { parseEquation, parseFunction } from "../../src/functions/sheet-equations";

describe("parseEquation", () => {
    test("should return null for invalid equations", () => {
        // No leading '='s
        expect(parseEquation("")).toBeNull();
        expect(parseEquation("123")).toBeNull();
    });

    test("should correctly evaluate simple equations", () => {
        expect(parseEquation("=1+2")).toBe("3");
        expect(parseEquation("=2*3")).toBe("6");
        expect(parseEquation("=6/2")).toBe("3");
        expect(parseEquation("=10-4")).toBe("6");

        // Testing order of operations
        expect(parseEquation("=2+3*4")).toBe("14");
    });

    test("should return null for equations with invalid characters", () => {
        // Invalid '&'
        expect(parseEquation("=2+3&4")).toBeNull();

        // Invalid '|'
        expect(parseEquation("=2|3")).toBeNull();

        // Invalid '<>'
        expect(parseEquation("=2<>3")).toBeNull();
    });
});

describe("parseFunction", () => {
    const mockData = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
    ];

    test("should return null for invalid functions", () => {
        // No leading '='s
        expect(parseFunction(mockData, "")).toBeNull();
        expect(parseFunction(mockData, "123")).toBeNull();
    });

    test("should correctly evaluate SUM function", () => {
        // Direct values
        expect(parseFunction(mockData, "=SUM(1,2,3)")).toBe("6");

        // Cell references
        expect(parseFunction(mockData, "=SUM($A1,$B1,$C1)")).toBe("6");
    });

    test("should correctly evaluate AVG function", () => {
        // Direct values
        expect(parseFunction(mockData, "=AVG(1,2,3)")).toBe("2");

        // Cell references
        expect(parseFunction(mockData, "=AVG($A1,$B1,$C1)")).toBe("2");
    });

    test("should correctly evaluate MAX function", () => {
        // Direct values
        expect(parseFunction(mockData, "=MAX(1,2,3)")).toBe("3");

        // Cell references
        expect(parseFunction(mockData, "=MAX($A3,$B2,$C3)")).toBe("9");
    });

    test("should correctly evaluate MIN function", () => {
        // Direct values
        expect(parseFunction(mockData, "=MIN(1,2,3)")).toBe("1");

        // Cell references
        expect(parseFunction(mockData, "=MIN($A1,$B1,$C1)")).toBe("1");
    });

    test("should correctly evaluate CONCAT function", () => {
        // Direct values
        expect(parseFunction(mockData, "=CONCAT(1,2,3)")).toBe("123");

        // Cell references
        expect(parseFunction(mockData, "=CONCAT($A1,$B1,$C1)")).toBe("123");
    });

    test("should correctly evaluate IF function", () => {
        // 1 is true, so return 2
        expect(parseFunction(mockData, "=IF(1,2,3)")).toBe("2");

        // 0 is false, so return 3
        expect(parseFunction(mockData, "=IF(0,2,3)")).toBe("3");

        // Cell references where $A1 is true, so return the value of $B1
        expect(parseFunction(mockData, "=IF($A1,$B1,$C1)")).toBe("2");
    });

    test("should correctly evaluate DEBUG function", () => {
        // Direct value
        expect(parseFunction(mockData, "=DEBUG(4)")).toBe("4");

        // Cell reference
        expect(parseFunction(mockData, "=DEBUG($A1)")).toBe("1");
    });

    test("should return null for invalid range functions", () => {
        // $C2 > $A1
        expect(parseFunction(mockData, "=SUM($C2:$A1)")).toBeNull();

        // $B1 > $A1
        expect(parseFunction(mockData, "=SUM($B1:$A1, $A2)")).toBeNull();
    });
});  
