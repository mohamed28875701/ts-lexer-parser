"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpressionStatement = exports.createReturnStatement = exports.createLetStatement = exports.createIdentifier = exports.createProgram = void 0;
const fs_1 = __importDefault(require("fs"));
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
