/**
 * @file sheet-equations.test.ts
 * @brief Tests for the sheet-equations functionality
 * @version 1.0
 * @date 06-02-2024
 * @author Troy Caron
 */

import { OperationParser } from "../../src/functions/sheet-operations";
import { FunctionParser } from "../../src/functions/sheet-functions";



describe("OperationParser", () => {
  const mockData = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"]
  ];

    it("should return null for invalid equations", () => {
        // No leading '='s
        expect(new OperationParser(mockData, "")).toBeNull();
        expect(new OperationParser(mockData, "2")).toBeNull();
        expect(new OperationParser(mockData, "123")).toBeNull();
        expect(new OperationParser(mockData, "SUM(1, 2)")).toBeNull();
    });

    test("should correctly evaluate simple equations", () => {
        expect(new OperationParser(mockData, "=1+2")).toBe("3");
        expect(new OperationParser(mockData, "=2*3")).toBe("6");
        expect(new OperationParser(mockData, "=6/2")).toBe("3");
        expect(new OperationParser(mockData, "=10-4")).toBe("6");

        // Testing order of operations
        expect(new OperationParser(mockData, "=2+3*4")).toBe("14");

        // Testing equations with extra spaces
        expect(new OperationParser(mockData, "= 2 + 3")).toBe("5");
        expect(new OperationParser(mockData, "=     6     - 4")).toBe("2");
    });

    test("should produce 'ERROR' for non-standard operations that don't fit the expected pattern", () => {
        // Invalid '&' after '|'
        expect(new OperationParser(mockData, "=2|&4")).toBe("ERROR");

        // Invalid '#' after '&'
        expect(new OperationParser(mockData, "=2&#3")).toBe("ERROR");
    });

    test("should produce 'ERROR' when both elements in a non-standard operation are not of the same type", () => {
        // Invalid '&' after '|'
        expect(new OperationParser(mockData, "=a|4")).toBe("ERROR");

        // Invalid 'a'
        expect(new OperationParser(mockData, "=2<>a")).toBe("ERROR");
    });


    it("should parse and evaluate simple arithmetic operations", () => {
        expect(new OperationParser(mockData, "= 1 + 2")).toEqual("3");
        expect(new OperationParser(mockData, "= 3 - 2")).toEqual("1");
        expect(new OperationParser(mockData, "= 2 * 3")).toEqual("6");
        expect(new OperationParser(mockData, "= 6 / 2")).toEqual("3");
      });
    
      it("should parse and evaluate cell references", () => {
        expect(new OperationParser(mockData, "= $A1 + $B1")).toEqual("3");
        expect(new OperationParser(mockData, "= $C3 * 2")).toEqual("18");
        expect(new OperationParser(mockData, "= $A2 + $B3")).toEqual("12");
      });
    
      it("should handle non-standard operations", () => {
        expect(new OperationParser(mockData, "= 1 = 1")).toEqual("1");
        expect(new OperationParser(mockData, "= 1 <> 2")).toEqual("1");
        expect(new OperationParser(mockData, "= 0 | 1")).toEqual("1");
        expect(new OperationParser(mockData, "= 1 & 1")).toEqual("1");
        expect(new OperationParser(mockData, "= 1 & 0")).toEqual("0");
        expect(new OperationParser(mockData, "= abc & 1")).toEqual("ERROR");
      });
    
      it("should handle invalid inputs", () => {
        expect(new OperationParser(mockData, "= 1 +")).toBeNull();
        expect(new OperationParser(mockData, "= @ + 1")).toBeNull();
        expect(new OperationParser(mockData, "= 1 + $")).toBeNull();
        expect(new OperationParser(mockData, "= <> 1")).toEqual("ERROR");
        expect(new OperationParser(mockData, "= 1 <> abc")).toEqual("ERROR");
      });
    
      it("should return null for malformed equations", () => {
        expect(new OperationParser(mockData, "1 + 2")).toBeNull();
        expect(new OperationParser(mockData, "=")).toBeNull();
        expect(new OperationParser(mockData, "= 1 +")).toBeNull();
      });
    
      it("should handle expressions with whitespace correctly", () => {
        expect(new OperationParser(mockData, "=  1  +  2 ")).toEqual("3");
        expect(new OperationParser(mockData, "= $A1 +  $B1")).toEqual("3");
      });
    
      it("should return 1 or 0 for boolean results", () => {
        expect(new OperationParser(mockData, "= 1 < 2")).toEqual("1");
        expect(new OperationParser(mockData, "= 2 < 1")).toEqual("0");
      });

      it("should return ERROR for unsupported non-standard operator", () => {
        const input = "= 1 == 1"; // This input uses a double equals which should trigger the default case
        expect(new OperationParser(mockData, input)).toBe("ERROR");
      });
    
      it("should return null for non-standard operation with mixed types", () => {
        const input = "= 1 + '1'";
        expect(new OperationParser(mockData, input)).toBe(null);
      });
    
      it("should return null for non-standard operation with non-standard symbols", () => {
        const input = "= 1 # 1";
        expect(new OperationParser(mockData, input)).toBe(null);
      });
    
      it("should return 0 for false", () => {
        const input = "= true = false";
        expect(new OperationParser(mockData, input)).toBe("0");
      });
    
      it("should return ERROR for non-standard operation with alphanumeric characters", () => {
        const input = "= abc = 123"; // This input uses alphanumeric characters in a way that should trigger the default case
        expect(new OperationParser(mockData, input)).toBe("ERROR");
      });
    
      it("should return null for complex non-standard operation", () => {
        const input = "= 1 + 1 * 2 ^ 3";
        expect(new OperationParser(mockData, input)).toBe(null);
      });
    
      it("should return null for non-standard operation with uncommon mathematical symbols", () => {
        const input = "= 1 ≠ 1";
        expect(new OperationParser(mockData, input)).toBe(null);
      });

      it("should return the expression when eval throws an error", () => {
        const input = "= 1 + (2"; // This input will cause eval to throw an error due to unmatched parentheses
        expect(new OperationParser(mockData, input)).toBe("1+(2");
      });

});









describe("FunctionParser", () => {
    const mockData = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"]
    ];
  
    test("should correctly parse and evaluate SUM function", () => {
        const parser = new FunctionParser(mockData, "=SUM(1, 2, 3)");
        expect(parser.parse()).toBe(6);

        const parser2 = new FunctionParser(mockData, "=SUM(99, 4, 2)");
        expect(parser2.parse()).toBe(105);

        const parser3 = new FunctionParser(mockData, "=SUM(3.3, 15, 9.2)");
        expect(parser3.parse()).toBe(27.5);
    });

    test("should correctly parse and evaluate IF function", () => {
        const parser = new FunctionParser(mockData, '=IF(1, "true", "false")');
        expect(parser.parse()).toBe("true");

        const parser1 = new FunctionParser(mockData, '=IF(0, "true", "false")');
        expect(parser1.parse()).toBe("false");

        expect(() => {
            const parser2 = new FunctionParser(mockData, '=IF("hello", "true", "false")');
            parser2.parse();
        }).toThrow("IF function first argument must be a number");

        const FunctionParser3 = new FunctionParser(mockData, '=IF(1, "33", "false")');
        expect(FunctionParser3.parse()).toBe("33");

        const FunctionParser4 = new FunctionParser(mockData, '=IF(0, "33", "34")');
        expect(FunctionParser4.parse()).toBe("34");
    });

    test("should correctly parse and evaluate nested functions", () => {
        const parser = new FunctionParser(mockData, '=IF(SUM(1, 2), "yes", "no")');
        expect(parser.parse()).toBe("yes");
        
        const parser1 = new FunctionParser(mockData, '=SUM(IF(1, 2, 3), IF(0, 4, 5))');
        // SUM(2, 5)
        expect(parser1.parse()).toBe(7);  

        const parser2 = new FunctionParser(mockData, '=MAX(IF(1, 2, 3), IF(0, 4, 1))');
        // MAX(2, 1)
        expect(parser2.parse()).toBe(2);  

        const parser3 = new FunctionParser(mockData, '=AVG(IF(1, 2, 3), IF(0, 4, 1))');
        // AVG(2, 1)
        expect(parser3.parse()).toBe(1.5);  

        const parser4 = new FunctionParser(mockData, '=CONCAT(IF(1, "yes", "no"), IF(0, "yes", "no"))');
        // CONCAT("yes", "no")
        expect(parser4.parse()).toBe("yesno");  

        const parser5 = new FunctionParser(mockData, '=IF($A1, IF($B1, "yes", "no"), "no")');
        // IF(1, IF(2, "yes", "no"), "no")
        expect(parser5.parse()).toBe("yes");  

        const parser6 = new FunctionParser(mockData, '=SUM(AVG($A1, $B1), AVG($A2, $B2))');
        // SUM(AVG(1, 2), AVG(4, 5))
        expect(parser6.parse()).toBe(6);  
    });

    // Test for expressions not starting with '='
    test("should throw an error for expressions not starting with '='", () => {
        expect(() => new FunctionParser(mockData, "SUM(1, 2, 3)").parse()).toThrow('Expression must start with "="');
    });

    // Test for unknown functions
    test("should throw an error for unknown functions", () => {
        expect(() => new FunctionParser(mockData, "=UNKNOWN(1, 2, 3)").parse()).toThrow("Unknown function: UNKNOWN");
    });

    // Test for IF function with incorrect number of arguments
    test("should throw an error for IF function with incorrect number of arguments", () => {
        expect(() => new FunctionParser(mockData, "=IF(1, 2)").parse()).toThrow("IF function requires exactly 3 arguments");
    });

    // Test for SUM function with non-number arguments
    test("should throw an error for SUM function with non-number arguments", () => {
        expect(() => new FunctionParser(mockData, '=SUM(1, "two", 3)').parse()).toThrow("SUM function requires all arguments to be numbers");
    });

    // Test for CONCAT function
    test("should correctly parse and evaluate CONCAT function", () => {
        const parser = new FunctionParser(mockData, '=CONCAT("Hello", " ", "World")');
        expect(parser.parse()).toBe("Hello World");
    });

    // Test for MIN function
    test("should correctly parse and evaluate MIN function", () => {
        const parser1 = new FunctionParser(mockData, "=MIN(1, 2, 3)");
        expect(parser1.parse()).toBe(1);
    });

    // Test for MAX function
    test("should correctly parse and evaluate MAX function", () => {
        const parser = new FunctionParser(mockData, "=MAX(1, 2, 3)");
        expect(parser.parse()).toBe(3);
    });

    // Test for AVG function
    test("should correctly parse and evaluate AVG function", () => {
        const parser = new FunctionParser(mockData, "=AVG(1, 2, 3)");
        expect(parser.parse()).toBe(2);
    });

    // Test for DEBUG function
    test("should correctly parse and evaluate DEBUG function", () => {
        const parser = new FunctionParser(mockData, "=DEBUG(1)");
        expect(parser.parse()).toBe(1);
    });

    // Test for SUM function with different numbers
    test("should correctly parse and evaluate SUM function with different numbers", () => {
        const parser = new FunctionParser(mockData, "=SUM(10, 20, 30)");
        expect(parser.parse()).toBe(60);
    });

    // Test for nested functions with different numbers
    test("should correctly parse and evaluate nested functions with different numbers", () => {
        const parser = new FunctionParser(mockData, '=IF(SUM(10, 20), "yes", "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for CONCAT function with different strings
    test("should correctly parse and evaluate CONCAT function with different strings", () => {
        const parser = new FunctionParser(mockData, '=CONCAT("Foo", "Bar", "Baz")');
        expect(parser.parse()).toBe("FooBarBaz");
    });

    // Test for complex nested functions
    test("should correctly parse and evaluate complex nested functions", () => {
        const parser = new FunctionParser(mockData, '=IF(SUM(1, IF(0, 2, 3)), "yes", "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for functions with negative numbers
    test("should correctly parse and evaluate functions with negative numbers", () => {
        const parser = new FunctionParser(mockData, "=SUM(-1, -2, -3)");
        expect(parser.parse()).toBe(-6);
    });

    // Test for functions with decimal numbers
    test("should correctly parse and evaluate functions with decimal numbers", () => {
        const parser = new FunctionParser(mockData, "=SUM(1.5, 2.5, 3.5)");
        expect(parser.parse()).toBe(7.5);
    });

    // Test for SUM with larger numbers
    test("should correctly parse and evaluate SUM with larger numbers", () => {
        const parser = new FunctionParser(mockData, "=SUM(100, 200, 300)");
        expect(parser.parse()).toBe(600);
    });

    // Test for MIN with negative numbers
    test("should correctly parse and evaluate MIN with negative numbers", () => {
        const parser = new FunctionParser(mockData, "=MIN(-1, -2, -3, 0, 1, 2, 3)");
        expect(parser.parse()).toBe(-3);
    });

    // Test for MAX with a mix of positive and negative numbers
    test("should correctly parse and evaluate MAX with a mix of positive and negative numbers", () => {
        const parser = new FunctionParser(mockData, "=MAX(-10, -20, 0, 10, 20)");
        expect(parser.parse()).toBe(20);
    });

    // Test for AVG with a mix of positive and negative numbers
    test("should correctly parse and evaluate AVG with a mix of positive and negative numbers", () => {
        const parser = new FunctionParser(mockData, "=AVG(-1, -2, -3, 1, 2, 3)");
        expect(parser.parse()).toBe(0);
    });

    // Test for nested SUM and AVG functions
    test("should correctly parse and evaluate nested SUM and AVG functions", () => {
        const parser = new FunctionParser(mockData, '=SUM(AVG(1, 2, 3), AVG(4, 5, 6))');
        expect(parser.parse()).toBe(7);
    });

    // Test for nested MIN and MAX functions
    test("should correctly parse and evaluate nested MIN and MAX functions", () => {
        const parser = new FunctionParser(mockData, '=MIN(MAX(1, 2), MAX(3, 4))');
        expect(parser.parse()).toBe(2);
    });

    // Test for IF function with nested conditions
    test("should correctly parse and evaluate IF function with nested conditions", () => {
        const parser = new FunctionParser(mockData, '=IF(1, IF(0, "no", "yes"), "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for CONCAT with numbers
    test("should correctly parse and evaluate CONCAT with numbers", () => {
        const parser = new FunctionParser(mockData, '=CONCAT("Result: ", SUM(1, 2, 3))');
        expect(parser.parse()).toBe("Result: 6");
    });

    // Test for SUM function with cell references
    test("should correctly parse and evaluate SUM function with cell references", () => {
        const parser = new FunctionParser(mockData, "=SUM($A1, $B1, $C1)");
        expect(parser.parse()).toBe(6);
    });

    // Test for IF function with cell references
    test("should correctly parse and evaluate IF function with cell references", () => {
        const parser = new FunctionParser(mockData, '=IF($A1, "true", "false")');
        expect(parser.parse()).toBe("true");
    });

    // Test for nested functions with cell references
    test("should correctly parse and evaluate nested functions with cell references", () => {
        const parser = new FunctionParser(mockData, '=IF(SUM($A1, $B1), "yes", "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for CONCAT function with cell references
    test("should correctly parse and evaluate CONCAT function with cell references", () => {
        const parser = new FunctionParser(mockData, '=CONCAT($A1, $B1, $C1)');
        expect(parser.parse()).toBe("123");
    });

    // Test for MIN function with cell references
    test("should correctly parse and evaluate MIN function with cell references", () => {
        const parser = new FunctionParser(mockData, "=MIN($A1, $B1, $C1)");
        expect(parser.parse()).toBe(1);
    });

    // Test for MAX function with cell references
    test("should correctly parse and evaluate MAX function with cell references", () => {
        const parser = new FunctionParser(mockData, "=MAX($A1, $B1, $C1)");
        expect(parser.parse()).toBe(3);
    });

    // Test for AVG function with cell references
    test("should correctly parse and evaluate AVG function with cell references", () => {
        const parser = new FunctionParser(mockData, "=AVG($A1, $B1, $C1)");
        expect(parser.parse()).toBe(2);
    });

    // Test for SUM function with mixed cell references and numbers
    test("should correctly parse and evaluate SUM function with mixed cell references and numbers", () => {
        const parser = new FunctionParser(mockData, "=SUM($A1, 2, $B1, 3)");
        expect(parser.parse()).toBe(8);
    });

    // Test for nested SUM and AVG functions with cell references
    test("should correctly parse and evaluate nested SUM and AVG functions with cell references", () => {
        const parser = new FunctionParser(mockData, '=SUM(AVG($A1, $B1, $C1), AVG($A2, $B2, $C2))');
        expect(parser.parse()).toBe(7);
    });

    // Test for nested MIN and MAX functions with cell references
    test("should correctly parse and evaluate nested MIN and MAX functions with cell references", () => {
        const parser = new FunctionParser(mockData, '=MIN(MAX($A1, $B1), MAX($A2, $B2))');
        expect(parser.parse()).toBe(2);
    });

    // Test for IF function with nested conditions and cell references
    test("should correctly parse and evaluate IF function with nested conditions and cell references", () => {
        const parser = new FunctionParser(mockData, '=IF($A1, IF($B1, "yes", "no"), "no")');
        expect(parser.parse()).toBe("yes");
    });

    // Test for CONCAT with cell references and strings
    test("should correctly parse and evaluate CONCAT with cell references and strings", () => {
        const parser = new FunctionParser(mockData, '=CONCAT("Value: ", $A1)');
        expect(parser.parse()).toBe("Value: 1");
    });

    it("should throw an error for unexpected characters", () => {
        const input = "= SUM(1, 2, 3) %"; // The '%' character is unexpected
        expect(() => {
          const parser = new FunctionParser(mockData, input);
          parser.parse();
        }).toThrow("Unexpected character: %");
      });

      it("should throw an error for token type mismatch", () => {
        // This input will cause a mismatch because after `=` it expects a function or valid expression
        const input = "= 123";
        expect(() => {
          const parser = new FunctionParser(mockData, input);
          parser.parse();
        }).toThrow("Unexpected token: 1");
      });
      
      it("should throw an error for unexpected token", () => {
        // This input will cause the FunctionParser to encounter an unexpected token type
        const input = "= SUM(1, 2, 3, [4])"; // The `[` character is unexpected
        expect(() => {
          const parser = new FunctionParser(mockData, input);
          parser.parse();
        }).toThrow("Unexpected character: [");
      });

      it("should throw an error for unexpected token in argument", () => {
        // This input will cause a mismatch because after `=` it expects a function or valid expression
        // but encounters an unexpected token (like a parenthesis without a matching function)
        const input = "= SUM(1, )";
        expect(() => {
          const parser = new FunctionParser(mockData, input);
          parser.parse();
        }).toThrow("Unexpected token: 5");
      });

      it("should throw an error for non-number arguments in MIN function", () => {
        const input = "= MIN(1, 'a', 3)";
        expect(() => {
          const parser = new FunctionParser(mockData, input);
          parser.parse();
        }).toThrow("MIN function requires all arguments to be numbers");
      });
    
      it("should throw an error for non-number arguments in MAX function", () => {
        const input = "= MAX(1, 2, 'b')";
        expect(() => {
          const parser = new FunctionParser(mockData, input);
          parser.parse();
        }).toThrow("MAX function requires all arguments to be numbers");
      });
    
      it("should throw an error for non-number arguments in AVG function", () => {
        const input = "= AVG(1, 'c', 3)";
        expect(() => {
          const parser = new FunctionParser(mockData, input);
          parser.parse();
        }).toThrow("AVG function requires all arguments to be numbers");
      });
    
      it("should throw an error for incorrect number of arguments in DEBUG function", () => {
        const input = "= DEBUG(1, 2)";
        expect(() => {
          const parser = new FunctionParser(mockData, input);
          parser.parse();
        }).toThrow("DEBUG function requires exactly 1 argument");
      });


      it("should throw an error for token type mismatch in eat function", () => {
        const input = "= SUM(1 2)"; // This input will cause a token type mismatch due to missing comma
        const parser = new FunctionParser(mockData, input);
    
        expect(() => {
          parser.parse();
        }).toThrow("Expected token type 5, but got 1");
      });

      it("should handle empty argument list in function call", () => {
        const input = "= SUM()"; // This input will hit the if statement in argumentList
        const parser = new FunctionParser(mockData, input);
    
        const result = parser.parse();
        expect(result).toEqual(0); // SUM with no arguments should return 0
      });
  });