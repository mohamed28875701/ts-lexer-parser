"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParser = void 0;
const ast_1 = require("../ast/ast");
const lexer_1 = require("../lex/lexer");
const token_1 = require("../lexer/token");
const helper_functions_1 = require("./helper_functions");
function createParser(lexer) {
    let p = {
        lex: lexer,
        errors: [],
        nextToken() {
            this.curToken = this.peekToken;
            this.peekToken = this.lex.nextToken();
        },
        parseProgram() {
            let pr = (0, ast_1.createProgram)();
            let i = 0;
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
            var _a;
            if (((_a = this.curToken) === null || _a === void 0 ? void 0 : _a.type) === token_1.TokenType.Let) {
                let stmt = this.parseLetStatement();
                return stmt;
            }
            else
                return undefined;
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
    };
    p.nextToken();
    p.nextToken();
    return p;
}
exports.createParser = createParser;
let lex = new lexer_1.lexer(`
let x = 5;
let y = 10;
let z = 838383;
`);
let par = createParser(lex);
let pr = par.parseProgram();
pr.statements.forEach(e => console.log(e));
