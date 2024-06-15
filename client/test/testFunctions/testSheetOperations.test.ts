import { OperationParser } from "../../src/functions/sheet-operations";

describe("OperationParser", () => {
  const mockData = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"]
  ];

  test("should throw an error for inputs not starting with '='", () => {
    expect(() => new OperationParser(mockData, "SUM(1, 2)").parse()).toThrow("Unexpected character: S");
  });

  test("should correctly parse and evaluate simple arithmetic operations", () => {
    expect(new OperationParser(mockData, "=1+2").parse()).toBe(3);
    expect(new OperationParser(mockData, "=2*3").parse()).toBe(6);
    expect(new OperationParser(mockData, "=6/2").parse()).toBe(3);
    expect(new OperationParser(mockData, "=10-4").parse()).toBe(6);
  });

  test("should correctly parse and evaluate comparisons", () => {
    expect(new OperationParser(mockData, "=1<2").parse()).toBe(1);
    expect(new OperationParser(mockData, "=2>1").parse()).toBe(1);
    expect(new OperationParser(mockData, "=1=1").parse()).toBe(1);
    expect(new OperationParser(mockData, "=1<>2").parse()).toBe(1);
  });

  test("should correctly parse and evaluate logical operations", () => {
    expect(new OperationParser(mockData, "=1&1").parse()).toBe(1);
    expect(new OperationParser(mockData, "=1&0").parse()).toBe(0);
    expect(new OperationParser(mockData, "=1|0").parse()).toBe(1);
    expect(new OperationParser(mockData, "=0|0").parse()).toBe(0);
  });

  test("should throw an error for unsupported operators", () => {
    expect(() => new OperationParser(mockData, "=1%2").parse()).toThrow("Unexpected character: %");
  });

  test("should correctly parse and evaluate parentheses", () => {
    expect(new OperationParser(mockData, "=(1+2)*3").parse()).toBe(9);
    expect(new OperationParser(mockData, "=(4-2)*(6/3)").parse()).toBe(4);
  });

  test("should throw an error for division by zero", () => {
    expect(() => new OperationParser(mockData, "=1/0").parse()).toThrow("Division by zero");
  });

  test("should correctly parse and evaluate strings", () => {
    expect(new OperationParser(mockData, "='Hello'").parse()).toBe("Hello");
    expect(new OperationParser(mockData, '="World"').parse()).toBe("World");
  });

  test("should correctly parse and evaluate mixed operations", () => {
    expect(new OperationParser(mockData, "=1+2*3").parse()).toBe(7);
    expect(new OperationParser(mockData, "=(1+2)*3").parse()).toBe(9);
  });

  test("should throw an error for unexpected characters", () => {
    expect(() => new OperationParser(mockData, "=1+2@").parse()).toThrow("Unexpected character: @");
  });

  test("should correctly parse and evaluate nested parentheses", () => {
    expect(new OperationParser(mockData, "=(1+(2*3))").parse()).toBe(7);
    expect(new OperationParser(mockData, "=((1+2)*(3+4))").parse()).toBe(21);
  });

  test("should handle whitespace correctly", () => {
    expect(new OperationParser(mockData, "= 1 + 2 ").parse()).toBe(3);
    expect(new OperationParser(mockData, "= ( 1 + 2 ) * 3 ").parse()).toBe(9);
  });

  test("should correctly parse and evaluate cell references", () => {
    expect(new OperationParser(mockData, "=$A1+$B1").parse()).toBe(3);
    expect(new OperationParser(mockData, "=$C3*2").parse()).toBe(18);
    expect(new OperationParser(mockData, "=$A2+$B3").parse()).toBe(12);
  });


  test("should return 1 or 0 for boolean results", () => {
    expect(new OperationParser(mockData, "=1<2").parse()).toBe(1);
    expect(new OperationParser(mockData, "=2<1").parse()).toBe(0);
  });


  test("should return null for non-standard operation with mixed types", () => {
    const input = "=1+'1'";
    expect(new OperationParser(mockData, input).parse()).toBe("11");
  });

  test("should throw an error if input does not start with '='", () => {
    const mockData = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"]
    ];
  
    expect(() => {
      new OperationParser(mockData, "1+1").parse();
    }).toThrow("Input must start with an '='");
  });

  test("should throw an error for unexpected token type in factor", () => {
    expect(() => {
      const parser = new OperationParser(mockData, "= #");
      parser.parse();
    }).toThrow("Unexpected character: #");
  });

  test("should throw an error for unsupported operator in applyOperator", () => {
    expect(() => {
      const parser = new OperationParser(mockData, "= 1 % 2");
      parser.parse();
    }).toThrow("Unexpected character: %");
  });   

});
