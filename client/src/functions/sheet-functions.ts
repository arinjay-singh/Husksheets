/**
 * @file sheet-functions.ts
 * @brief A simple function to parse and evaluate simple mathematical operations.
 * @version 1.0
 * @date 06-11-2024
 * @author Arinjay Singh
 */

import {
  parseCellReferences,
  replaceCellRangesWithValues,
} from "./cell-referencing";

// Enum for token types
enum TokenType {
  FUNCTION,
  NUMBER,
  STRING,
  COMMA,
  PAREN_OPEN,
  PAREN_CLOSE,
  EQUALS,
  EOF,
}

// Token class
class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string = "") {
    this.type = type;
    this.value = value;
  }
}

// Tokenizer class
class FunctionTokenizer {
  input: string;
  position: number = 0;
  currentChar: string | null;

  // Constructor that initializes the input and currentChar
  constructor(input: string) {
    this.input = input;
    this.currentChar = this.input[this.position];
  }

  // Function to advance the position and currentChar
  advance() {
    this.position++;
    this.currentChar =
      this.position < this.input.length ? this.input[this.position] : null;
  }

  // Function to skip whitespace
  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  // Function to get the next token
  getNextToken(): Token {
    // Loop through the input until the end
    // Return the token based on the current character
    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      if (/[A-Za-z]/.test(this.currentChar)) {
        return this._function();
      }

      if (/[0-9]/.test(this.currentChar) || this.currentChar === "." || this.currentChar === "-") {
        return this._number();
      }

      if (this.currentChar === ",") {
        this.advance();
        return new Token(TokenType.COMMA, ",");
      }

      if (this.currentChar === "(") {
        this.advance();
        return new Token(TokenType.PAREN_OPEN, "(");
      }

      if (this.currentChar === ")") {
        this.advance();
        return new Token(TokenType.PAREN_CLOSE, ")");
      }

      if (this.currentChar === '"' || this.currentChar === "'") {
        return this._string();
      }

      if (this.currentChar === "=") {
        this.advance();
        return new Token(TokenType.EQUALS, "=");
      }
      // Throw an error if the character is unexpected
      throw new Error(`Unexpected character: ${this.currentChar}`);
    }
    // Return an EOF token when the input ends
    return new Token(TokenType.EOF);
  }

  // Function to parse a function and return a token
  _function(): Token {
    let result = "";
    while (this.currentChar !== null && /[A-Za-z]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return new Token(TokenType.FUNCTION, result.toUpperCase());
  }

  // Function to parse a number and return a token
  _number(): Token {
    let result = "";
    while (this.currentChar !== null && /[0-9.-]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return new Token(TokenType.NUMBER, result);
  }

  // Function to parse a string and return a token
  _string(): Token {
    let result = "";
    const quoteType = this.currentChar;
    this.advance();
    while (this.currentChar !== null && this.currentChar !== quoteType) {
      result += this.currentChar;
      this.advance();
    }
    this.advance(); // Skip the closing quote
    return new Token(TokenType.STRING, result);
  }
}

// Parser class
export class FunctionParser {
  tokenizer: FunctionTokenizer;
  currentToken: Token;

  // Constructor that initializes the tokenizer and currentToken
  // Parses the input and replaces cell ranges with values
  constructor(data: string[][], input: string) {
    const parsedRanges = replaceCellRangesWithValues(data, input);
    const parsedReferences = parseCellReferences(data, parsedRanges);
    this.tokenizer = new FunctionTokenizer(parsedReferences);
    this.currentToken = this.tokenizer.getNextToken();
  }

  // Function to consume a token
  eat(tokenType: TokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.tokenizer.getNextToken();
    } else {
      throw new Error(
        `Expected token type ${tokenType}, but got ${this.currentToken.type}`
      );
    }
  }

  // Function to parse the input
  parse() {
    if (this.currentToken.type !== TokenType.EQUALS) {
      throw new Error('Expression must start with "="');
    }
    this.eat(TokenType.EQUALS); // Eat the '=' token
    return this.expr();
  }

  // Function to parse an expression
  expr(): any {
    if (this.currentToken.type === TokenType.FUNCTION) {
      const functionName = this.currentToken.value;
      this.eat(TokenType.FUNCTION);
      this.eat(TokenType.PAREN_OPEN);
      const args = this.argumentList();
      this.eat(TokenType.PAREN_CLOSE);
      return this.evaluateFunction(functionName, args);
    }

    throw new Error(`Unexpected token: ${this.currentToken.type}`);
  }

  // Function to parse a list of arguments
  argumentList(): any[] {
    const args = [];
    if (this.currentToken.type !== TokenType.PAREN_CLOSE) {
      args.push(this.argument());
      while (this.currentToken.type === TokenType.COMMA) {
        this.eat(TokenType.COMMA);
        args.push(this.argument());
      }
    }
    return args;
  }

  // Function to parse an argument
  argument(): any {
    if (this.currentToken.type === TokenType.NUMBER) {
      const value = parseFloat(this.currentToken.value);
      this.eat(TokenType.NUMBER);
      return value;
    }

    if (this.currentToken.type === TokenType.STRING) {
      const value = this.currentToken.value;
      this.eat(TokenType.STRING);
      return value;
    }

    if (this.currentToken.type === TokenType.FUNCTION) {
      return this.expr();
    }

    throw new Error(`Unexpected token: ${this.currentToken.type}`);
  }

  // Function to evaluate a function
  evaluateFunction(functionName: string, args: any[]): any {
    switch (functionName) {
      case "IF":
        return this.evaluateIF(args);
      case "SUM":
        return this.evaluateSUM(args);
      case "MIN":
        return this.evaluateMIN(args);
      case "MAX":
        return this.evaluateMAX(args);
      case "AVG":
        return this.evaluateAVG(args);
      case "CONCAT":
        return this.evaluateCONCAT(args);
      case "DEBUG":
        return this.evaluateDEBUG(args);
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }

  // Function to evaluate the IF function
  evaluateIF(args: any[]): any {
    if (args.length !== 3) {
      throw new Error("IF function requires exactly 3 arguments");
    }
    const [e1, e2, e3] = args;
    if (typeof e1 !== "number") {
      throw new Error("IF function first argument must be a number");
    }
    return e1 !== 0 ? e2 : e3;
  }

  // Function to evaluate the SUM function
  evaluateSUM(args: any[]): number {
    if (args.some((arg) => typeof arg !== "number")) {
      throw new Error("SUM function requires all arguments to be numbers");
    }
    return args.reduce((acc, curr) => acc + curr, 0);
  }

  // Function to evaluate the MIN function
  evaluateMIN(args: any[]): number {
    if (args.some((arg) => typeof arg !== "number")) {
      throw new Error("MIN function requires all arguments to be numbers");
    }
    return Math.min(...args);
  }

  // Function to evaluate the MAX function
  evaluateMAX(args: any[]): number {
    if (args.some((arg) => typeof arg !== "number")) {
      throw new Error("MAX function requires all arguments to be numbers");
    }
    return Math.max(...args);
  }

  // Function to evaluate the AVG function
  evaluateAVG(args: any[]): number {
    if (args.some((arg) => typeof arg !== "number")) {
      throw new Error("AVG function requires all arguments to be numbers");
    }
    return args.reduce((acc, curr) => acc + curr, 0) / args.length;
  }

  // Function to evaluate the CONCAT function
  evaluateCONCAT(args: any[]): string {
    return args.join("");
  }

  // Function to evaluate the DEBUG function
  evaluateDEBUG(args: any[]): any {
    if (args.length !== 1) {
      throw new Error("DEBUG function requires exactly 1 argument");
    }
    console.log(args[0]);
    return args[0];
  }
}
