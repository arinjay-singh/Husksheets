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
        expect(parseEquation("2")).toBeNull();
        expect(parseEquation("123")).toBeNull();
        expect(parseEquation("SUM(1, 2)")).toBeNull();
    });

    test("should correctly evaluate simple equations", () => {
        expect(parseEquation("=1+2")).toBe("3");
        expect(parseEquation("=2*3")).toBe("6");
        expect(parseEquation("=6/2")).toBe("3");
        expect(parseEquation("=10-4")).toBe("6");

        // Testing order of operations
        expect(parseEquation("=2+3*4")).toBe("14");

        // Testing equations with extra spaces
        expect(parseEquation("= 2 + 3")).toBe("5");
        expect(parseEquation("=     6     - 4")).toBe("2");
    });

    test("should produce 'ERROR' for non-standard operations that don't fit the expected pattern", () => {
        // Invalid '&' after '|'
        expect(parseEquation("=2|&4")).toBe("ERROR");

        // Invalid '#' after '&'
        expect(parseEquation("=2&#3")).toBe("ERROR");
    });

    test("should produce 'ERROR' when both elements in a non-standard operation are not of the same type", () => {
        // Invalid '&' after '|'
        expect(parseEquation("=a|4")).toBe("ERROR");

        // Invalid 'a'
        expect(parseEquation("=2<>a")).toBe("ERROR");
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
        expect(parseFunction(mockData, "13")).toBeNull();
        expect(parseFunction(mockData, "*3, 3")).toBeNull();
        expect(parseFunction(mockData, "SUM(1, 2, 3")).toBeNull();
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
        expect(parseFunction(mockData, "=AVG(3,6,9)")).toBe("6");
        expect(parseFunction(mockData, "=AVG(4,4,3)")).toBe("3.6666666666666665");
        expect(parseFunction(mockData, "=AVG(3,7)")).toBe("5");
        expect(parseFunction(mockData, "=AVG(3,6,9,14)")).toBe("8");

        // Cell references
        expect(parseFunction(mockData, "=AVG($C3,$B1)")).toBe("5.5");
        expect(parseFunction(mockData, "=AVG($C2,$B1,$A3)")).toBe("5");
        expect(parseFunction(mockData, "=AVG($A1,$C1,$A3,$C3)")).toBe("5");

        // Mixed values
        expect(parseFunction(mockData, "=AVG($A1,5,$C1, 3)")).toBe("3");
    });

    test("should correctly evaluate MAX function", () => {
        // Direct values
        expect(parseFunction(mockData, "=MAX(4,22,3)")).toBe("22");
        expect(parseFunction(mockData, "=MAX(5,3)")).toBe("5");
        expect(parseFunction(mockData, "=MAX(4,7, 1, 0)")).toBe("7");
        expect(parseFunction(mockData, "=MAX(4,3.9,3,9.999)")).toBe("9.999");
        expect(parseFunction(mockData, "=MAX(5,5,5,5)")).toBe("5");

        // Cell references
        expect(parseFunction(mockData, "=MAX($B3,$B2,$B1)")).toBe("8");
        expect(parseFunction(mockData, "=MAX($A1,$B2,$C3)")).toBe("9");
        expect(parseFunction(mockData, "=MAX($B2,$A1)")).toBe("5");

        // Mixed values
        expect(parseFunction(mockData, "=MAX($C1,5,$B2, 3)")).toBe("5");
    });

    test("should correctly evaluate MIN function", () => {
        // Direct values
        expect(parseFunction(mockData, "=MIN(4,22,3)")).toBe("3");
        expect(parseFunction(mockData, "=MIN(5,3)")).toBe("3");
        expect(parseFunction(mockData, "=MIN(4,7, 1, 0)")).toBe("0");
        expect(parseFunction(mockData, "=MIN(4,3.9,3,9.999)")).toBe("3");
        expect(parseFunction(mockData, "=MIN(5,5,5,5)")).toBe("5");

        // Cell references
        expect(parseFunction(mockData, "=MIN($B3,$B2,$B1)")).toBe("2");
        expect(parseFunction(mockData, "=MIN($A1,$B2,$C3)")).toBe("1");
        expect(parseFunction(mockData, "=MIN($B2,$A1)")).toBe("1");

        // Mixed values
        expect(parseFunction(mockData, "=MIN($C1,5,$B2, 3)")).toBe("3");
    });

    test("should correctly evaluate CONCAT function", () => {
        // Direct values
        expect(parseFunction(mockData, "=CONCAT(1,2,3)")).toBe("123");
        expect(parseFunction(mockData, "=CONCAT(44,2)")).toBe("442");
        expect(parseFunction(mockData, "=CONCAT(1)")).toBe("1");

        // Cell references
        expect(parseFunction(mockData, "=CONCAT($A1,$B1,$C1)")).toBe("123");
        expect(parseFunction(mockData, "=CONCAT($A1,$C1,$C1)")).toBe("133");
        expect(parseFunction(mockData, "=CONCAT($B3,$A2)")).toBe("84");

        // Mixed values
        expect(parseFunction(mockData, "=CONCAT($B2,5,$A2, 3)")).toBe("5543");
    });

    test("should correctly evaluate IF function", () => {
        // 1 is true, so return 2
        expect(parseFunction(mockData, "=IF(1,2,3)")).toBe("2");

        // wrong number of arguments
        expect(parseFunction(mockData, "=IF(1,2)")).toBeNull();

        // 0 is false, so return 3
        expect(parseFunction(mockData, "=IF(0,2,3)")).toBe("3");

        // Cell references where $A1 is true, so return the value of $B1
        expect(parseFunction(mockData, "=IF($A1,$B1,$C1)")).toBe("2");

        // Mixed values
        expect(parseFunction(mockData, "=IF($A1,22,$C1)")).toBe("22");
        expect(parseFunction(mockData, "=IF(34,$B1,$A3)")).toBe("2");

    });

    test("should correctly evaluate DEBUG function", () => {
        // Direct value
        expect(parseFunction(mockData, "=DEBUG(4)")).toBe("4");

        // NaN
        expect(parseFunction(mockData, "=DEBUG(a)")).toBeNull();

        // Wrong number of arguments
        expect(parseFunction(mockData, "=DEBUG(4, 2)")).toBeNull();

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
