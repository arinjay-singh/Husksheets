/**
 * @file testSheetEquations.test.ts
 * @brief Tests for the parsers
 * @version 1.0
 * @date 06-12-2024
 * @author Troy Caron
 */

import { parseEquation } from '../../src/functions/sheet-equations';

describe("parseEquation", () => {

    const mockData = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
    ];
    
    test("should return null for invalid equations", () => {
        // No leading '='s
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
        // Invalid '&' after '|'
        expect(parseEquation(mockData, "=2|&4")).toBe("ERROR");

        // Invalid '#' after '&'
        expect(parseEquation(mockData, "=2&#3")).toBe("ERROR");
    });

    test("should produce 'ERROR' when both elements in a non-standard operation are not of the same type", () => {
        // Invalid '&' after '|'
        expect(parseEquation(mockData, "=a|4")).toBe("ERROR");

        // Invalid 'a'
        expect(parseEquation(mockData, "=2<>a")).toBe("ERROR");
    });
});






import { Parser } from "../../src/functions/sheet-functions";
import test, {describe} from "node:test";
import {expect} from "sucrase/dist/types/parser/traverser/util";

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
        // SUM(2, 5)
        expect(parser1.parse()).toBe(7);  

        const parser3 = new Parser(mockData, '=MAX(IF(1, 2, 3), IF(0, 4, 1))');
        // MAX(2, 1)
        expect(parser3.parse()).toBe(2);  

        const parser4 = new Parser(mockData, '=AVG(IF(1, 2, 3), IF(0, 4, 1))');
        // AVG(2, 1)
        expect(parser4.parse()).toBe(1.5);  

        const parser5 = new Parser(mockData, '=CONCAT(IF(1, "yes", "no"), IF(0, "yes", "no"))');
        // CONCAT("yes", "no")
        expect(parser5.parse()).toBe("yesno");  

        const parser6 = new Parser(mockData, '=IF($A1, IF($B1, "yes", "no"), "no")');
        // IF(1, IF(2, "yes", "no"), "no")
        expect(parser6.parse()).toBe("yes");  

        const parser7 = new Parser(mockData, '=SUM(AVG($A1, $B1), AVG($A2, $B2))');
        // SUM(AVG(1, 2), AVG(4, 5))
        expect(parser7.parse()).toBe(6);  
    });

    // Test for expressions not starting with '='
    test("should throw an error for expressions not starting with '='", () => {
        expect(() => new Parser(mockData, "SUM(1, 2, 3)").parse()).toThrow('Expression must start with "="');
    });

    // Test for unknown functions
    test("should throw an error for unknown functions", () => {
        expect(() => new Parser(mockData, "=UNKNOWN(1, 2, 3)").parse()).toThrow("Unknown function: UNKNOWN");
    });

    // Test for IF function with incorrect number of arguments
    test("should throw an error for IF function with incorrect number of arguments", () => {
        expect(() => new Parser(mockData, "=IF(1, 2)").parse()).toThrow("IF function requires exactly 3 arguments");
    });

    // Test for SUM function with non-number arguments
    test("should throw an error for SUM function with non-number arguments", () => {
        expect(() => new Parser(mockData, '=SUM(1, "two", 3)').parse()).toThrow("SUM function requires all arguments to be numbers");
    });

    // Test for CONCAT function
    test("should correctly parse and evaluate CONCAT function", () => {
        const parser = new Parser(mockData, '=CONCAT("Hello", " ", "World")');
        expect(parser.parse()).toBe("Hello World");
    });

    // Test for MIN function
    test("should correctly parse and evaluate MIN function", () => {
        const parser = new Parser(mockData, "=MIN(1, 2, 3)");
        expect(parser.parse()).toBe(1);
    });

    // Test for MAX function
    test("should correctly parse and evaluate MAX function", () => {
        const parser = new Parser(mockData, "=MAX(1, 2, 3)");
        expect(parser.parse()).toBe(3);
    });

    // Test for AVG function
    test("should correctly parse and evaluate AVG function", () => {
        const parser = new Parser(mockData, "=AVG(1, 2, 3)");
        expect(parser.parse()).toBe(2);
    });

    // Test for DEBUG function
    test("should correctly parse and evaluate DEBUG function", () => {
        const parser = new Parser(mockData, "=DEBUG(1)");
        expect(parser.parse()).toBe(1);
    });

    // Test for SUM function with different numbers
    test("should correctly parse and evaluate SUM function with different numbers", () => {
        const parser = new Parser(mockData, "=SUM(10, 20, 30)");
        expect(parser.parse()).toBe(60);
    });

    // Test for nested functions with different numbers
    test("should correctly parse and evaluate nested functions with different numbers", () => {
        const parser = new Parser(mockData, '=IF(SUM(10, 20), "yes", "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for CONCAT function with different strings
    test("should correctly parse and evaluate CONCAT function with different strings", () => {
        const parser = new Parser(mockData, '=CONCAT("Foo", "Bar", "Baz")');
        expect(parser.parse()).toBe("FooBarBaz");
    });

    // Test for complex nested functions
    test("should correctly parse and evaluate complex nested functions", () => {
        const parser = new Parser(mockData, '=IF(SUM(1, IF(0, 2, 3)), "yes", "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for functions with negative numbers
    test("should correctly parse and evaluate functions with negative numbers", () => {
        const parser = new Parser(mockData, "=SUM(-1, -2, -3)");
        expect(parser.parse()).toBe(-6);
    });

    // Test for functions with decimal numbers
    test("should correctly parse and evaluate functions with decimal numbers", () => {
        const parser = new Parser(mockData, "=SUM(1.5, 2.5, 3.5)");
        expect(parser.parse()).toBe(7.5);
    });

    // Test for SUM with larger numbers
    test("should correctly parse and evaluate SUM with larger numbers", () => {
        const parser = new Parser(mockData, "=SUM(100, 200, 300)");
        expect(parser.parse()).toBe(600);
    });

    // Test for MIN with negative numbers
    test("should correctly parse and evaluate MIN with negative numbers", () => {
        const parser = new Parser(mockData, "=MIN(-1, -2, -3, 0, 1, 2, 3)");
        expect(parser.parse()).toBe(-3);
    });

    // Test for MAX with a mix of positive and negative numbers
    test("should correctly parse and evaluate MAX with a mix of positive and negative numbers", () => {
        const parser = new Parser(mockData, "=MAX(-10, -20, 0, 10, 20)");
        expect(parser.parse()).toBe(20);
    });

    // Test for AVG with a mix of positive and negative numbers
    test("should correctly parse and evaluate AVG with a mix of positive and negative numbers", () => {
        const parser = new Parser(mockData, "=AVG(-1, -2, -3, 1, 2, 3)");
        expect(parser.parse()).toBe(0);
    });

    // Test for nested SUM and AVG functions
    test("should correctly parse and evaluate nested SUM and AVG functions", () => {
        const parser = new Parser(mockData, '=SUM(AVG(1, 2, 3), AVG(4, 5, 6))');
        expect(parser.parse()).toBe(7);
    });

    // Test for nested MIN and MAX functions
    test("should correctly parse and evaluate nested MIN and MAX functions", () => {
        const parser = new Parser(mockData, '=MIN(MAX(1, 2), MAX(3, 4))');
        expect(parser.parse()).toBe(2);
    });

    // Test for IF function with nested conditions
    test("should correctly parse and evaluate IF function with nested conditions", () => {
        const parser = new Parser(mockData, '=IF(1, IF(0, "no", "yes"), "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for CONCAT with numbers
    test("should correctly parse and evaluate CONCAT with numbers", () => {
        const parser = new Parser(mockData, '=CONCAT("Result: ", SUM(1, 2, 3))');
        expect(parser.parse()).toBe("Result: 6");
    });

    // Test for SUM function with cell references
    test("should correctly parse and evaluate SUM function with cell references", () => {
        const parser = new Parser(mockData, "=SUM($A1, $B1, $C1)");
        expect(parser.parse()).toBe(6);
    });

    // Test for IF function with cell references
    test("should correctly parse and evaluate IF function with cell references", () => {
        const parser = new Parser(mockData, '=IF($A1, "true", "false")');
        expect(parser.parse()).toBe("true");
    });

    // Test for nested functions with cell references
    test("should correctly parse and evaluate nested functions with cell references", () => {
        const parser = new Parser(mockData, '=IF(SUM($A1, $B1), "yes", "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for CONCAT function with cell references
    test("should correctly parse and evaluate CONCAT function with cell references", () => {
        const parser = new Parser(mockData, '=CONCAT($A1, $B1, $C1)');
        expect(parser.parse()).toBe("123");
    });

    // Test for MIN function with cell references
    test("should correctly parse and evaluate MIN function with cell references", () => {
        const parser = new Parser(mockData, "=MIN($A1, $B1, $C1)");
        expect(parser.parse()).toBe(1);
    });

    // Test for MAX function with cell references
    test("should correctly parse and evaluate MAX function with cell references", () => {
        const parser = new Parser(mockData, "=MAX($A1, $B1, $C1)");
        expect(parser.parse()).toBe(3);
    });

    // Test for AVG function with cell references
    test("should correctly parse and evaluate AVG function with cell references", () => {
        const parser = new Parser(mockData, "=AVG($A1, $B1, $C1)");
        expect(parser.parse()).toBe(2);
    });

    // Test for SUM function with mixed cell references and numbers
    test("should correctly parse and evaluate SUM function with mixed cell references and numbers", () => {
        const parser = new Parser(mockData, "=SUM($A1, 2, $B1, 3)");
        expect(parser.parse()).toBe(8);
    });

    // Test for nested SUM and AVG functions with cell references
    test("should correctly parse and evaluate nested SUM and AVG functions with cell references", () => {
        const parser = new Parser(mockData, '=SUM(AVG($A1, $B1, $C1), AVG($A2, $B2, $C2))');
        expect(parser.parse()).toBe(7);
    });

    // Test for nested MIN and MAX functions with cell references
    test("should correctly parse and evaluate nested MIN and MAX functions with cell references", () => {
        const parser = new Parser(mockData, '=MIN(MAX($A1, $B1), MAX($A2, $B2))');
        expect(parser.parse()).toBe(2);
    });

    // Test for IF function with nested conditions and cell references
    test("should correctly parse and evaluate IF function with nested conditions and cell references", () => {
        const parser = new Parser(mockData, '=IF($A1, IF($B1, "yes", "no"), "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for CONCAT with cell references and strings
    test("should correctly parse and evaluate CONCAT with cell references and strings", () => {
        const parser = new Parser(mockData, '=CONCAT("Value: ", $A1)');
        expect(parser.parse()).toBe("Value: 1");
    });

});