import { parseCellReferences, replaceCellRangesWithValues } from "./cell-referencing";

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

class Token {
    type: TokenType;
    value: string;

    constructor(type: TokenType, value: string = '') {
        this.type = type;
        this.value = value;
    }
}

class Tokenizer {
    input: string;
    position: number = 0;
    currentChar: string | null;

    constructor(input: string) {
        this.input = input;
        this.currentChar = this.input[this.position];
    }

    advance() {
        this.position++;
        this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
    }

    skipWhitespace() {
        while (this.currentChar && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    getNextToken(): Token {
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (/[A-Za-z]/.test(this.currentChar)) {
                return this._function();
            }

            if (/[0-9]/.test(this.currentChar) || this.currentChar === '.') {
                return this._number();
            }

            if (this.currentChar === ',') {
                this.advance();
                return new Token(TokenType.COMMA, ',');
            }

            if (this.currentChar === '(') {
                this.advance();
                return new Token(TokenType.PAREN_OPEN, '(');
            }

            if (this.currentChar === ')') {
                this.advance();
                return new Token(TokenType.PAREN_CLOSE, ')');
            }

            if (this.currentChar === '"' || this.currentChar === "'") {
                return this._string();
            }

            if (this.currentChar === '=') {
                this.advance();
                return new Token(TokenType.EQUALS, '=');
            }

            throw new Error(`Unexpected character: ${this.currentChar}`);
        }

        return new Token(TokenType.EOF);
    }

    _function(): Token {
        let result = '';
        while (this.currentChar !== null && /[A-Za-z]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return new Token(TokenType.FUNCTION, result.toUpperCase());
    }

    _number(): Token {
        let result = '';
        while (this.currentChar !== null && /[0-9.]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return new Token(TokenType.NUMBER, result);
    }

    _string(): Token {
        let result = '';
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

export class Parser {
    tokenizer: Tokenizer;
    currentToken: Token;

    constructor(data: string[][], input: string) {
        const parsedRanges = replaceCellRangesWithValues(data, input);
        const parsedReferences = parseCellReferences(data, parsedRanges);
        this.tokenizer = new Tokenizer(parsedReferences);
        this.currentToken = this.tokenizer.getNextToken();
    }

    eat(tokenType: TokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.tokenizer.getNextToken();
        } else {
            throw new Error(`Expected token type ${tokenType}, but got ${this.currentToken.type}`);
        }
    }

    parse() {
        if (this.currentToken.type !== TokenType.EQUALS) {
            throw new Error('Expression must start with "="');
        }
        this.eat(TokenType.EQUALS); // Eat the '=' token
        return this.expr();
    }

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

    evaluateFunction(functionName: string, args: any[]): any {
        switch (functionName) {
            case 'IF':
                return this.evaluateIF(args);
            case 'SUM':
                return this.evaluateSUM(args);
            case 'MIN':
                return this.evaluateMIN(args);
            case 'MAX':
                return this.evaluateMAX(args);
            case 'AVG':
                return this.evaluateAVG(args);
            case 'CONCAT':
                return this.evaluateCONCAT(args);
            case 'DEBUG':
                return this.evaluateDEBUG(args);
            default:
                throw new Error(`Unknown function: ${functionName}`);
        }
    }

    evaluateIF(args: any[]): any {
        if (args.length !== 3) {
            throw new Error('IF function requires exactly 3 arguments');
        }
        const [e1, e2, e3] = args;
        if (typeof e1 !== 'number') {
            throw new Error('IF function first argument must be a number');
        }
        return e1 !== 0 ? e2 : e3;
    }

    evaluateSUM(args: any[]): number {
        if (args.some(arg => typeof arg !== 'number')) {
            throw new Error('SUM function requires all arguments to be numbers');
        }
        return args.reduce((acc, curr) => acc + curr, 0);
    }

    evaluateMIN(args: any[]): number {
        if (args.some(arg => typeof arg !== 'number')) {
            throw new Error('MIN function requires all arguments to be numbers');
        }
        return Math.min(...args);
    }

    evaluateMAX(args: any[]): number {
        if (args.some(arg => typeof arg !== 'number')) {
            throw new Error('MAX function requires all arguments to be numbers');
        }
        return Math.max(...args);
    }

    evaluateAVG(args: any[]): number {
        if (args.some(arg => typeof arg !== 'number')) {
            throw new Error('AVG function requires all arguments to be numbers');
        }
        return args.reduce((acc, curr) => acc + curr, 0) / args.length;
    }

    evaluateCONCAT(args: any[]): string {
        return args.join('');
    }

    evaluateDEBUG(args: any[]): any {
        if (args.length !== 1) {
            throw new Error('DEBUG function requires exactly 1 argument');
        }
        return args[0];
    }
}

// // Example usage
// const input = '=SUM(1, SUM(2, 3), MIN(4, 5))';
// console.log(new Parser(input).parse()); // Output: 10
