"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParser = void 0;
const ast_1 = require("../ast/ast");
const lexer_1 = require("../lex/lexer");
const token_1 = require("../lexer/token");
const helper_functions_1 = require("./helper_functions");
const ex = {
    LOWEST: 0,
    EQUALS: 1,
    LESSGREATER: 2,
    SUM: 3,
    PRODCUT: 4,
    PREFIX: 5,
    CALL: 6
};
function createParser(lexer) {
    let p = {
        lex: lexer,
        errors: [],
        prefixParseFns: new Map(),
        nextToken() {
            this.curToken = this.peekToken;
            this.peekToken = this.lex.nextToken();
        },
        parseProgram() {
            let pr = (0, ast_1.createProgram)();
            while (this.curToken.type !== token_1.TokenType.Eof) {
                let stmt = this.parseStatement();
                if (stmt !== undefined) {
                    pr.statements.push(stmt);
                }
                this.nextToken();
            }
            return pr;
        },
        parseStatement() {
            var _a, _b;
            if (((_a = this.curToken) === null || _a === void 0 ? void 0 : _a.type) === token_1.TokenType.Let) {
                let stmt = this.parseLetStatement();
                return stmt;
            }
            else if (((_b = this.curToken) === null || _b === void 0 ? void 0 : _b.type) === token_1.TokenType.Return) {
                let stmt = this.parseReturnStatement();
                return stmt;
            }
            return this.parseExpressionStatement();
        },
        parseLetStatement() {
            let stmt = (0, ast_1.createLetStatement)(this.curToken);
            if (!this.expectPeek(token_1.TokenType.Ident)) {
                return undefined;
            }
            stmt.name = (0, ast_1.createIdentifier)(this.curToken, this.curToken.literal);
            if (!this.expectPeek(token_1.TokenType.Assign)) {
                return undefined;
            }
            while (!(0, helper_functions_1.curTokenIs)(this, token_1.TokenType.Semicolon)) {
                this.nextToken();
            }
            return stmt;
        },
        parseReturnStatement() {
            let stmt = (0, ast_1.createReturnStatement)(this.curToken);
            this.nextToken();
            while (!(0, helper_functions_1.curTokenIs)(this, token_1.TokenType.Semicolon)) {
                this.nextToken();
            }
            return stmt;
        },
        expectPeek(token) {
            if ((0, helper_functions_1.peekTokenIs)(this, token)) {
                this.nextToken();
                return true;
            }
            else {
                this.peekError(token);
                return false;
            }
        },
        peekError(token) {
            let err = `expected next token to be ${token} got ${this.peekToken.type} instead`;
            console.log(err);
            this.errors.push(err);
        },
        registerPrefix(type, prefixparseFn) {
            this.prefixParseFns.set(type, prefixparseFn);
        },
        registerinfix(type, infixFn) {
            this.infixParseFns.set(type, infixFn);
        },
        parseExpressionStatement() {
            let stmt = (0, ast_1.createExpressionStatement)(this.curToken);
            stmt.expression = this.parseExpression(ex.LOWEST);
            return stmt;
        },
        parseExpression(precedence) {
            let prefix = this.prefixParseFns.get(this.curToken.type);
            console.log(prefix);
            console.log(this.curToken);
            if (prefix === undefined)
                return undefined;
            let leftExp = prefix();
            return leftExp;
        },
        parseIdent() {
            return (0, ast_1.createIdentifier)(this.curToken, this.curToken.literal);
        }
    };
    p.nextToken();
    p.nextToken();
    let parseI = p.parseIdent.bind(p);
    p.registerPrefix(token_1.TokenType.Ident, parseI);
    return p;
}
exports.createParser = createParser;
let lex = new lexer_1.lexer(`foobar;`);
let par = createParser(lex);
let pr = par.parseProgram();
pr.statements.forEach(e => console.log(e));
pr.to_string();
