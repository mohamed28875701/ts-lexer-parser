"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooleanLiteral = exports.createExpressionStatement = exports.createReturnStatement = exports.createLetStatement = exports.createIntegralLiteral = exports.createIdentifier = exports.createProgram = exports.createPrefixExpression = exports.createInfixExpression = exports.precedences = exports.ex = void 0;
const fs_1 = __importDefault(require("fs"));
;
exports.ex = {
    LOWEST: 0,
    EQUALS: 1,
    LESSGREATER: 2,
    SUM: 3,
    PRODCUT: 4,
    PREFIX: 5,
    CALL: 6
};
exports.precedences = {
    "==": 1,
    "!=": 1,
    "<": 2,
    ">": 2,
    "+": 3,
    "-": 3,
    "/": 4,
    "*": 4,
};
function createInfixExpression(token, operator, left) {
    let ie = {
        token: token,
        operator: operator,
        left: left,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s = "{" + this.left.to_string() + " " + this.operator + " " + this.right.to_string() + "}";
            return s;
        },
    };
    return ie;
}
exports.createInfixExpression = createInfixExpression;
;
function createPrefixExpression(token, operator) {
    let pe = {
        token: token,
        operator: operator,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s = "";
            s += "(" + this.operator + " " + this.right.to_string() + ")";
            ;
            return s;
        },
    };
    return pe;
}
exports.createPrefixExpression = createPrefixExpression;
function createProgram() {
    let program = {
        statements: [],
        tokenLiteral() {
            if (this.statements.length > 0)
                return this.statements[0].tokenLiteral();
            else
                return "";
        },
        to_string() {
            fs_1.default.writeFile("buf.txt", "", 'utf8', () => console.log("."));
            this.statements.forEach(e => {
                fs_1.default.appendFile("buf.txt", e.to_string() + `\n`, 'utf8', () => console.log("."));
            });
            return "";
        },
    };
    return program;
}
exports.createProgram = createProgram;
function createIdentifier(token, value) {
    let id = {
        token: token,
        value: value,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            return this.value;
        },
    };
    return id;
}
exports.createIdentifier = createIdentifier;
function createIntegralLiteral(token, value) {
    let id = {
        token: token,
        value: value,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            return this.value;
        },
    };
    return id;
}
exports.createIntegralLiteral = createIntegralLiteral;
function createLetStatement(token) {
    let ls = {
        token: token,
        StatementNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s = "";
            s = s + " " + this.tokenLiteral() + " " + this.name.to_string();
            if (this.value !== undefined)
                s = s + this.value.to_string();
            s += ";";
            return s;
        },
    };
    return ls;
}
exports.createLetStatement = createLetStatement;
function createReturnStatement(token) {
    let rs = {
        token: token,
        StatementNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s = "";
            s = s + this.tokenLiteral() + " ";
            if (this.returnValue !== undefined)
                s += this.returnValue.to_string();
            s += ";";
            return s;
        },
    };
    return rs;
}
exports.createReturnStatement = createReturnStatement;
function createExpressionStatement(token) {
    let es = {
        token: token,
        StatementNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s = "";
            s = s + this.tokenLiteral() + " ";
            if (this.expression !== undefined)
                s += this.expression.to_string();
            s += ";";
            return s;
        },
    };
    return es;
}
exports.createExpressionStatement = createExpressionStatement;
function createBooleanLiteral(token, value) {
    let bl = {
        token: token,
        value: value,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            return this.tokenLiteral();
        },
    };
    return bl;
}
exports.createBooleanLiteral = createBooleanLiteral;
;
