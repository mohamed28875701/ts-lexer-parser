"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.keywords = exports.TokenType = void 0;
exports.TokenType = {
    Illegal: "Illegal",
    Eof: "EOF",
    Ident: "ident",
    Int: "int",
    Assign: "=",
    Comma: ",",
    Semicolon: ";",
    Lparen: "(",
    Rparen: ")",
    Lbrace: "{",
    Rbrace: "}",
    // Keywords,
    Function: "fn",
    Let: "LET",
    Plus: "+",
    Minus: "-",
    Bang: "!",
    Asterisk: "*",
    Slash: "/",
    Lt: "<",
    Gt: ">",
    True: "TRUE",
    False: "FALSE",
    If: "IF",
    Else: "ELSE",
    Return: "RETURN",
    Eq: "==",
    Not_eq: "!=",
};
exports.keywords = {
    "fn": createToken(exports.TokenType.Function, "fn"),
    "let": createToken(exports.TokenType.Let, "let"),
    "true": createToken(exports.TokenType.True, "true"),
    "false": createToken(exports.TokenType.False, "false"),
    "if": createToken(exports.TokenType.If, "if"),
    "else": createToken(exports.TokenType.Else, "else"),
    "return": createToken(exports.TokenType.Return, "return"),
};
function createToken(type, literal) {
    let t = {
        type: type,
        literal: literal
    };
    return t;
}
exports.createToken = createToken;
