"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexer = void 0;
const token_1 = require("../lexer/token");
class lexer {
    constructor(input) {
        this.position = 0;
        this.readPosition = 0;
        this.input = input;
        this.readChar();
    }
    readChar() {
        if (this.readPosition >= this.input.length)
            this.ch = '\0';
        else
            this.ch = this.input[this.readPosition];
        this.position = this.readPosition;
        this.readPosition += 1;
    }
    nextToken() {
        let token;
        this.skipWhiteSpace();
        switch (this.ch) {
            case "=":
                if (this.peek() === "=") {
                    token = (0, token_1.createToken)(token_1.TokenType.Eq, this.ch + "=");
                    this.readChar();
                }
                else
                    token = (0, token_1.createToken)(token_1.TokenType.Assign, this.ch);
                break;
            case ";":
                token = (0, token_1.createToken)(token_1.TokenType.Semicolon, this.ch);
                break;
            case "(":
                token = (0, token_1.createToken)(token_1.TokenType.Lparen, this.ch);
                break;
            case ")":
                token = (0, token_1.createToken)(token_1.TokenType.Rparen, this.ch);
                break;
            case "+":
                token = (0, token_1.createToken)(token_1.TokenType.Plus, this.ch);
                break;
            case "{":
                token = (0, token_1.createToken)(token_1.TokenType.Lbrace, this.ch);
                break;
            case "}":
                token = (0, token_1.createToken)(token_1.TokenType.Rbrace, this.ch);
                break;
            case "-":
                token = (0, token_1.createToken)(token_1.TokenType.Minus, this.ch);
                break;
            case "!":
                if (this.peek() === "=") {
                    token = (0, token_1.createToken)(token_1.TokenType.Not_eq, this.ch + "=");
                    this.readChar();
                }
                else
                    token = (0, token_1.createToken)(token_1.TokenType.Bang, this.ch);
                break;
            case "*":
                token = (0, token_1.createToken)(token_1.TokenType.Asterisk, this.ch);
                break;
            case "/":
                token = (0, token_1.createToken)(token_1.TokenType.Slash, this.ch);
                break;
            case ",":
                token = (0, token_1.createToken)(token_1.TokenType.Comma, this.ch);
                break;
            case "<":
                token = (0, token_1.createToken)(token_1.TokenType.Lt, this.ch);
                break;
            case ">":
                token = (0, token_1.createToken)(token_1.TokenType.Gt, this.ch);
                break;
            case '\0':
                token = (0, token_1.createToken)(token_1.TokenType.Eof, "");
                break;
            default:
                if (this.isLetter(this.ch)) {
                    let key = this.readIdentifier();
                    if (this.checkInKey(key)) {
                        let f = token_1.keywords[key];
                        token = (0, token_1.createToken)(f.type, key);
                        return token;
                    }
                    else {
                        token = (0, token_1.createToken)(token_1.TokenType.Ident, key);
                        return token;
                    }
                }
                else if (this.isNumber()) {
                    token = (0, token_1.createToken)(token_1.TokenType.Int, this.readInt());
                }
                else {
                    token = (0, token_1.createToken)(token_1.TokenType.Illegal, this.ch);
                }
        }
        this.readChar();
        return token;
    }
    readIdentifier() {
        let position = this.position;
        while (this.isLetter(l.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }
    isLetter(ch) {
        return ch.match(/[a-zA-Z_]/i) !== null;
    }
    readInt() {
        const position = this.position;
        while (this.isNumber()) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }
    isNumber() {
        return this.ch.match(/[0-9]/i) !== null;
    }
    skipWhiteSpace() {
        while (this.ch === " " || this.ch === "\t" || this.ch === "\n" || this.ch === "\r")
            this.readChar();
    }
    checkInKey(key) {
        return key in token_1.keywords;
    }
    peek() {
        if (this.readPosition >= this.input.length) {
            return '\0';
        }
        else {
            return this.input[l.readPosition];
        }
    }
}
exports.lexer = lexer;
let test = `let five = 5;
let ten = 10;
let add = fn(x, y) {
x + y;
};
let result = add(five, ten);
!-/*5;
5 < 10 > 5;
if (5 < 10) {
return true;
} else {
return false;
}
10 == 10;
10 != 9;
`;
let l = new lexer(test);
const token = l.nextToken();
while (true) {
    const token = l.nextToken();
    console.log(token);
    if (token.type === "EOF") {
        break;
    }
}
