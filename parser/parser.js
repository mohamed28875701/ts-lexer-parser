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
        prefixParseFns: new Map(),
        infixParseFns: new Map(),
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
        noPrefixParseError(type) {
            let msg = `no perfix parser function for ${type} found`;
            console.log(msg);
            this.errors.push(msg);
        },
        registerPrefix(type, prefixparseFn) {
            this.prefixParseFns.set(type, prefixparseFn);
        },
        registerinfix(type, infixFn) {
            this.infixParseFns.set(type, infixFn);
        },
        parseExpressionStatement() {
            if (this.curToken.type === token_1.TokenType.Semicolon)
                return undefined;
            let stmt = (0, ast_1.createExpressionStatement)(this.curToken);
            stmt.expression = this.parseExpression(ast_1.ex.LOWEST);
            return stmt;
        },
        parseExpression(precedence) {
            let prefix = this.prefixParseFns.get(this.curToken.type);
            if (prefix === undefined) {
                this.noPrefixParseError(this.curToken.type);
                return undefined;
            }
            let leftExp = prefix();
            while (!(0, helper_functions_1.peekTokenIs)(this, token_1.TokenType.Semicolon) && precedence < this.peekPrecendence()) {
                let infix = this.infixParseFns.get(this.peekToken.type);
                if (infix == undefined)
                    return leftExp;
                this.nextToken();
                leftExp = infix(leftExp);
            }
            return leftExp;
        },
        parseIdent() {
            return (0, ast_1.createIdentifier)(this.curToken, this.curToken.literal);
        },
        parseInteger() {
            let int = (0, ast_1.createIntegralLiteral)(this.curToken, parseInt(this.curToken.literal));
            return int;
        },
        parsePrefixExpression() {
            let expression = (0, ast_1.createPrefixExpression)(this.curToken, this.curToken.literal);
            console.log(this.curToken.type + "bef");
            this.nextToken();
            console.log(this.curToken.type + "aft");
            expression.right = this.parseExpression(ast_1.ex.PREFIX);
            return expression;
        },
        peekPrecendence() {
            let p = ast_1.precedences[this.peekToken.type];
            if (p > 0)
                return p;
            return ast_1.ex.LOWEST;
        },
        curPrecendence() {
            let p = ast_1.precedences[this.curToken.type];
            if (p > 0)
                return p;
            return ast_1.ex.LOWEST;
        },
        parseInfixExpression(expr) {
            let exp = (0, ast_1.createInfixExpression)(this.curToken, this.curToken.literal, expr);
            let prec = this.curPrecendence();
            this.nextToken();
            exp.right = this.parseExpression(prec);
            return exp;
        },
        parseBoolean() {
            return (0, ast_1.createBooleanLiteral)(this.curToken, this.curToken.literal == "true");
        },
        parseGroupedExpressions() {
            this.nextToken();
            let exp = this.parseExpression(ast_1.ex.LOWEST);
            if (!this.expectPeek(token_1.TokenType.Rparen))
                return undefined;
            return exp;
        },
        parseBlockStatement() {
            let block = (0, ast_1.createBlockStatement)(this.curToken);
            this.nextToken();
            while (!(0, helper_functions_1.curTokenIs)(this, token_1.TokenType.Rbrace) && !(0, helper_functions_1.curTokenIs)(this, token_1.TokenType.Rbrace)) {
                let stmt = this.parseStatement();
                if (stmt !== undefined)
                    block.statements.push(stmt);
                this.nextToken();
            }
            ;
            return block;
        },
        parseIfEpression() {
            let ie = (0, ast_1.createIfExpression)(this.curToken);
            if (!this.expectPeek(token_1.TokenType.Lparen)) {
                return undefined;
            }
            this.nextToken();
            ie.condition = this.parseExpression(ast_1.ex.LOWEST);
            if (!this.expectPeek(token_1.TokenType.Rparen)) {
                return undefined;
            }
            if (!this.expectPeek(token_1.TokenType.Lbrace)) {
                console.log("hey");
                return undefined;
            }
            ie.consequence = this.parseBlockStatement();
            if ((0, helper_functions_1.peekTokenIs)(this, token_1.TokenType.Else)) {
                this.nextToken();
                if (!this.expectPeek(token_1.TokenType.Lbrace)) {
                    return undefined;
                }
                ie.alternative = this.parseBlockStatement();
            }
            return ie;
        },
        parseParams() {
            let params = [];
            if ((0, helper_functions_1.peekTokenIs)(this, token_1.TokenType.Rparen))
                return params;
            this.nextToken();
            let id = (0, ast_1.createIdentifier)(this.curToken, this.curToken.literal);
            params.push(id);
            while ((0, helper_functions_1.peekTokenIs)(this, token_1.TokenType.Comma)) {
                this.nextToken();
                this.nextToken();
                id = (0, ast_1.createIdentifier)(this.curToken, this.curToken.literal);
                params.push(id);
            }
            ;
            if (!this.expectPeek(token_1.TokenType.Rparen))
                return undefined;
            return params;
        },
        parseFunctionExpression() {
            let fn = (0, ast_1.createFunctionLiteral)(this.curToken);
            if (!this.expectPeek(token_1.TokenType.Lparen))
                return undefined;
            fn.params = this.parseParams();
            if (!this.expectPeek(token_1.TokenType.Lbrace))
                return undefined;
            fn.body = this.parseBlockStatement();
            return fn;
        },
        parseCallArgs() {
            let args = [];
            if ((0, helper_functions_1.peekTokenIs)(this, token_1.TokenType.Rparen)) {
                this.nextToken();
                return args;
            }
            this.nextToken();
            args.push(this.parseExpression(ast_1.ex.LOWEST));
            while ((0, helper_functions_1.peekTokenIs)(this, token_1.TokenType.Comma)) {
                this.nextToken();
                this.nextToken();
                args.push(this.parseExpression(ast_1.ex.LOWEST));
            }
            ;
            if (!this.expectPeek(token_1.TokenType.Rparen))
                return undefined;
            return args;
        },
        parseCallExpression(fn) {
            let ce = (0, ast_1.createCallExpression)(this.curToken, fn);
            ce.arguments = this.parseCallArgs();
            return ce;
        },
    };
    p.nextToken();
    p.nextToken();
    let parseI = p.parseIdent.bind(p);
    p.registerPrefix(token_1.TokenType.Ident, parseI);
    p.registerPrefix(token_1.TokenType.Int, p.parseInteger.bind(p));
    p.registerPrefix(token_1.TokenType.Int, p.parseInteger.bind(p));
    p.registerPrefix(token_1.TokenType.False, p.parseBoolean.bind(p));
    p.registerPrefix(token_1.TokenType.True, p.parseBoolean.bind(p));
    p.registerPrefix(token_1.TokenType.Bang, p.parsePrefixExpression.bind(p));
    p.registerPrefix(token_1.TokenType.Minus, p.parsePrefixExpression.bind(p));
    p.registerPrefix(token_1.TokenType.Lparen, p.parseGroupedExpressions.bind(p));
    p.registerPrefix(token_1.TokenType.If, p.parseIfEpression.bind(p));
    p.registerPrefix(token_1.TokenType.Function, p.parseFunctionExpression.bind(p));
    p.registerinfix(token_1.TokenType.Eq, p.parseInfixExpression.bind(p));
    p.registerinfix(token_1.TokenType.Not_eq, p.parseInfixExpression.bind(p));
    p.registerinfix(token_1.TokenType.Plus, p.parseInfixExpression.bind(p));
    p.registerinfix(token_1.TokenType.Minus, p.parseInfixExpression.bind(p));
    p.registerinfix(token_1.TokenType.Asterisk, p.parseInfixExpression.bind(p));
    p.registerinfix(token_1.TokenType.Slash, p.parseInfixExpression.bind(p));
    p.registerinfix(token_1.TokenType.Gt, p.parseInfixExpression.bind(p));
    p.registerinfix(token_1.TokenType.Lt, p.parseInfixExpression.bind(p));
    p.registerinfix(token_1.TokenType.Lparen, p.parseCallExpression.bind(p));
    return p;
}
exports.createParser = createParser;
let lex = new lexer_1.lexer('add(1, 2 * 3, 4 + 5);');
let par = createParser(lex);
let pr = par.parseProgram();
pr.statements.forEach(e => console.log(e));
pr.to_string();
