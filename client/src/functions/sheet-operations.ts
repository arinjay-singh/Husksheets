/**
 * @file sheet-operations.ts
 * @brief A simple function to parse and evaluate simple mathematical operations.
 * @date 06-14-2024
 * @author Arinjay Singh
 */

import { parseCellReferences } from "./cell-referencing";

/**
 * @author Arinjay Singh
 */
// Enums for token types to include logical and comparison operators
enum TokenType {
  NUMBER,
  STRING,
  OPERATOR,
  PAREN_OPEN,
  PAREN_CLOSE,
  EOF,
}

/**
 * @author Arinjay Singh
 */
// Token class
class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string = "") {
    this.type = type;
    this.value = value;
  }
}

/**
 * @author Arinjay Singh
 */
// Tokenizer class for parsing inputs
class OperationTokenizer {
  input: string;
  position: number = 0;
  currentChar: string | null;

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

  // Function to get the next token
  getNextToken(): Token {
    while (this.currentChar !== null) {
      if (this.currentChar.trim() === "") {
        this.advance();
        continue;
      }

      if (/\d/.test(this.currentChar)) {
        return new Token(TokenType.NUMBER, this.readNumber());
      }

      if (this.currentChar === '"' || this.currentChar === "'") {
        return new Token(TokenType.STRING, this.readString());
      }

      if (/[\+\-\*\/<>&|=]/.test(this.currentChar)) {
        return new Token(TokenType.OPERATOR, this.readOperator());
      }

      if (this.currentChar === "(") {
        this.advance();
        return new Token(TokenType.PAREN_OPEN, "(");
      }

      if (this.currentChar === ")") {
        this.advance();
        return new Token(TokenType.PAREN_CLOSE, ")");
      }

      throw new Error(`Unexpected character: ${this.currentChar}`);
    }

    return new Token(TokenType.EOF, "");
  }

  // Function to read a number
  readNumber() {
    let result = "";
    while (this.currentChar !== null && /[\d\.]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return result;
  }

  // Function to read a string
  readString() {
    const quote = this.currentChar;
    this.advance(); // skip opening quote
    let result = "";
    while (this.currentChar !== null && this.currentChar !== quote) {
      result += this.currentChar;
      this.advance();
    }
    this.advance(); // skip closing quote
    return result;
  }

  // Function to read an operator
  readOperator() {
    let result = this.currentChar;
    this.advance(); // Advance past the first character of the operator
    if (result === "<" && this.currentChar === ">") {
      this.advance(); // Advance past the second character
      return "<>";
    }
    return result as string | undefined;
  }
}

/**
 * @author Arinjay Singh
 */
// Parser class
export class OperationParser {
  tokens: Token[];
  position: number = 0;

  // Constructor to parse the input
  // swap out cell references for their values
  constructor(data: string[][], input: string) {
    const parsedReferences = parseCellReferences(data, input);
    const tokenizer = new OperationTokenizer(parsedReferences);
    const tokens = [];
    let token;
    do {
      token = tokenizer.getNextToken();
      tokens.push(token);
    } while (token.type !== TokenType.EOF);
    this.tokens = tokens;
  }

  // Function to parse the input
  parse() {
    if (this.tokens.length === 0) return;
    const firstToken = this.tokens[this.position];
    if (firstToken.value !== "=") {
      throw new Error("Input must start with an '='");
    }
    this.advance();
    return this.expression();
  }

  // Function to get the current token
  current() {
    return this.tokens[this.position] || new Token(TokenType.EOF, "");
  }

  // Function to advance the position
  advance() {
    if (this.current().type !== TokenType.EOF) {
      this.position++;
    }
  }

  // Function to expect a token type
  expect(type: TokenType) {
    if (this.current().type !== type) {
      throw new Error(
        `Expected token type ${type}, but found ${this.current().type}`
      );
    }
    const token = this.current();
    this.advance();
    return token;
  }

  // Function to parse an expression
  expression() {
    let leftValue = this.term();

    while (
      this.current().type === TokenType.OPERATOR &&
      !["(", ")"].includes(this.current().value)
    ) {
      const operator = this.expect(TokenType.OPERATOR).value;
      const rightValue = this.term();
      leftValue = this.applyOperator(leftValue, operator, rightValue);
    }

    return leftValue;
  }

  // Function to parse a term
  term() {
    let result = this.factor();

    while (
      this.current().type === TokenType.OPERATOR &&
      ["*", "/"].includes(this.current().value)
    ) {
      const operator = this.current().value;
      this.advance();
      result = this.applyOperator(result, operator, this.factor());
    }

    return result;
  }

  // Function to parse a factor
  factor(): any {
    const token = this.current();

    switch (token.type) {
      case TokenType.NUMBER:
        this.advance();
        return parseFloat(token.value);
      case TokenType.STRING:
        this.advance();
        return token.value;
      case TokenType.PAREN_OPEN:
        this.advance(); // skip '('
        const value = this.expression();
        this.expect(TokenType.PAREN_CLOSE); // expect and skip ')'
        return value;
      default:
        throw new Error(`Unexpected token type: ${token.type}`);
    }
  }

  // Function to apply an operator
  applyOperator(left: any, operator: any, right: any) {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        if (right === 0) throw new Error("Division by zero");
        return left / right;
      case "<":
        return left < right ? 1 : 0;
      case ">":
        return left > right ? 1 : 0;
      case "=":
        return left === right ? 1 : 0;
      case "<>":
        return left !== right ? 1 : 0;
      case "&":
        return left !== 0 && right !== 0 ? 1 : 0;
      case "|":
        return left !== 0 || right !== 0 ? 1 : 0;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }
}

/**
 * @author Arinjay Singh
 */
export const extractSimpleEquation = (data: string[][], inputString: string) => {
    const regex = /\b(\d+\s*[+\-*/=><]\s*\d+)\b/;
    const matches = inputString.match(regex);
    if (matches) {
        let match = matches[0];
        let result = new OperationParser(data, '=' + match).parse();
        let newString = inputString.replace(match, result.toString());
        return newString;
    }
    return inputString;
};