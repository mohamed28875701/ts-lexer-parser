"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReturnStatement = exports.createLetStatement = exports.createIdentifier = exports.createProgram = void 0;
function createProgram() {
    let program = {
        statements: [],
        TokenLiteral() {
            if (this.statements.length > 0)
                return this.statements[0].tokenLiteral();
            else
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
            var _a;
            return (_a = this.token) === null || _a === void 0 ? void 0 : _a.literal;
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
    };
    return rs;
}
exports.createReturnStatement = createReturnStatement;
