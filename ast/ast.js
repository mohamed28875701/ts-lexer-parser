"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLetStatement = exports.createIdentifier = exports.createProgram = void 0;
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
function createIdentifier() {
    let id = {
        token: undefined,
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
function createLetStatement() {
    let ls = {
        StatementNode() {
            return undefined;
        },
        tokenLiteral() {
            var _a;
            return (_a = this.token) === null || _a === void 0 ? void 0 : _a.literal;
        },
    };
    return ls;
}
exports.createLetStatement = createLetStatement;
