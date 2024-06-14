/**
 * @file testSheetEquations.test.ts
 * @brief Tests for the parsers
 * @version 1.0
 * @date 06-12-2024
 */

import { parseEquation } from '../../src/functionality/sheet-equations';
import { Parser } from '../../src/functionality/sheet-functions';

describe("parseEquation", () => {
    const mockData = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
    ];

    test("should return null for invalid equations", () => {
        expect(parseEquation(mockData, "")).toBeNull();
        expect(parseEquation(mockData, "2")).toBeNull();
        expect(parseEquation(mockData, "123")).toBeNull();
        expect(parseEquation(mockData, "SUM(1, 2)")).toBeNull();
    });

    test("should correctly evaluate simple equations", () => {
        expect(parseEquation(mockData, "=1+2")).toBe("3");
        expect(parseEquation(mockData, "=2*3")).toBe("6");
        expect(parseEquation(mockData, "=6/2")).toBe("3");
        expect(parseEquation(mockData, "=10-4")).toBe("6");

        // Testing order of operations
        expect(parseEquation(mockData, "=2+3*4")).toBe("14");

        // Testing equations with extra spaces
        expect(parseEquation(mockData, "= 2 + 3")).toBe("5");
        expect(parseEquation(mockData, "=     6     - 4")).toBe("2");
    });

    test("should produce 'ERROR' for non-standard operations that don't fit the expected pattern", () => {
        expect(parseEquation(mockData, "=2|&4")).toBe("ERROR");
        expect(parseEquation(mockData, "=2&#3")).toBe("ERROR");
    });

    test("should produce 'ERROR' when both elements in a non-standard operation are not of the same type", () => {
        expect(parseEquation(mockData, "=a|4")).toBe("ERROR");
        expect(parseEquation(mockData, "=2<>a")).toBe("ERROR");
    });
});

describe("Parser", () => {
    const mockData = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
    ];

    test("should correctly parse and evaluate SUM function", () => {
        const parser = new Parser(mockData, "=SUM(1, 2, 3)");
        expect(parser.parse()).toBe(6);

        const parser1 = new Parser(mockData, "=SUM(99, 4, 2)");
        expect(parser1.parse()).toBe(105);

        const parser2 = new Parser(mockData, "=SUM(3.3, 15, 9.2)");
        expect(parser2.parse()).toBe(27.5);
    });

    test("should correctly parse and evaluate IF function", () => {
        const parser = new Parser(mockData, '=IF(1, "true", "false")');
        expect(parser.parse()).toBe("true");

        const parser1 = new Parser(mockData, '=IF(0, "true", "false")');
        expect(parser1.parse()).toBe("false");

        expect(() => {
            const parser2 = new Parser(mockData, '=IF("hello", "true", "false")');
            parser2.parse();
        }).toThrow("IF function first argument must be a number");

        const parser3 = new Parser(mockData, '=IF(1, "33", "false")');
        expect(parser3.parse()).toBe("33");

        const parser4 = new Parser(mockData, '=IF(0, "33", "34")');
        expect(parser4.parse()).toBe("34");
    });

    test("should correctly parse and evaluate nested functions", () => {
        const parser = new Parser(mockData, '=IF(SUM(1, 2), "yes", "no")');
        expect(parser.parse()).toBe("yes");

        const parser1 = new Parser(mockData, '=SUM(IF(1, 2, 3), IF(0, 4, 5))');
        expect(parser1.parse()).toBe(7);

        const parser3 = new Parser(mockData, '=MAX(IF(1, 2, 3), IF(0, 4, 1))');
        expect(parser3.parse()).toBe(2);

        const parser4 = new Parser(mockData, '=AVG(IF(1, 2, 3), IF(0, 4, 1))');
        expect(parser4.parse()).toBe(1.5);

        const parser5 = new Parser(mockData, '=CONCAT(IF(1, "yes", "no"), IF(0, "yes", "no"))');
        expect(parser5.parse()).toBe("yesno");

        const parser6 = new Parser(mockData, '=IF($A1, IF($B1, "yes", "no"), "no")');
        expect(parser6.parse()).toBe("yes");

        const parser7 = new Parser(mockData, '=SUM(AVG($A1, $B1), AVG($A2, $B2))');
        expect(parser7.parse()).toBe(6);
    });

    test("should throw an error for expressions not starting with '='", () => {
        expect(() => new Parser(mockData, "SUM(1, 2, 3)").parse()).toThrow('Expression must start with "="');
    });

    test("should throw an error for unknown functions", () => {
        expect(() => new Parser(mockData, "=UNKNOWN(1, 2, 3)").parse()).toThrow("Unknown function: UNKNOWN");
    });

    test("should throw an error for IF function with incorrect number of arguments", () => {
        expect(() => new Parser(mockData, "=IF(1, 2)").parse()).toThrow("IF function requires exactly 3 arguments");
    });

    test("should throw an error for SUM function with non-number arguments", () => {
        expect(() => new Parser(mockData, '=SUM(1, "two", 3)').parse()).toThrow("SUM function requires all arguments to be numbers");
    });

    test("should correctly parse and evaluate CONCAT function", () => {
        const parser = new Parser(mockData, '=CONCAT("Hello", " ", "World")');
        expect(parser.parse()).toBe("Hello World");
    });

    test("should correctly parse and evaluate MIN function", () => {
        const parser = new Parser(mockData, "=MIN(1, 2, 3)");
        expect(parser.parse()).toBe(1);
    });

    test("should correctly parse and evaluate MAX function", () => {
        const parser = new Parser(mockData, "=MAX(1, 2, 3)");
        expect(parser.parse()).toBe(3);
    });

    test("should correctly parse and evaluate AVG function", () => {
        const parser = new Parser(mockData, "=AVG(1, 2, 3)");
        expect(parser.parse()).toBe(2);
    });

    test("should correctly parse and evaluate DEBUG function", () => {
        const parser = new Parser(mockData, "=DEBUG(1)");
        expect(parser.parse()).toBe(1);
    });

    test("should correctly parse and evaluate SUM function with different numbers", () => {
        const parser = new Parser(mockData, "=SUM(10, 20, 30)");
        expect(parser.parse()).toBe(60);
    });

    test("should correctly parse and evaluate nested functions with different numbers", () => {
        const parser = new Parser(mockData, '=IF(SUM(10, 20), "yes", "no")');
        expect(parser.parse()).toBe("yes");
    });

    test("should correctly parse and evaluate CONCAT function with different strings", () => {
        const parser = new Parser(mockData, '=CONCAT("Foo", "Bar", "Baz")');
        expect(parser.parse()).toBe("FooBarBaz");
    });

    test("should correctly parse and evaluate complex nested functions", () => {
        const parser = new Parser(mockData, '=IF(SUM(1, IF(0, 2, 3)), "yes", "no")');
        expect(parser.parse()).toBe("yes");
    });

    test("should correctly parse and evaluate functions with negative numbers", () => {
        const parser = new Parser(mockData, "=SUM(-1, -2, -3)");
        expect(parser.parse()).toBe(-6);
    });
});
