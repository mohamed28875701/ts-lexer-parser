import { Expression, Identifier, LetStatement, Program, Statement, createBooleanLiteral, createExpressionStatement, createIdentifier, createInfixExpression, createIntegralLiteral, createLetStatement, createPrefixExpression, createProgram, createReturnStatement, ex, expressionStatement, precedences, prefixExpression, returnStatement } from "../ast/ast";
import { lexer } from "../lex/lexer";
import { Token, TokenType } from "../lexer/token";
import { curTokenIs, peekTokenIs } from "./helper_functions";
import { prefixParseFn,infixParseFn } from "../ast/ast";
export interface Parser{
    lex : lexer;
    curToken : Token;
    peekToken : Token;
    errors:string[],
    prefixParseFns : Map<string,prefixParseFn>,
    infixParseFns : Map<string,infixParseFn>,
    nextToken : ()=> void;
    parseProgram:()=>Program;
    parseStatement:()=>expressionStatement|LetStatement|returnStatement|undefined;
    parseLetStatement:()=>LetStatement|undefined;
    expectPeek:(token:string)=>boolean;
    peekError:(token:string)=>void;
    parseReturnStatement : ()=>returnStatement|undefined;
    parseExpressionStatement : ()=>expressionStatement|undefined;
    registerPrefix:(type:string,prefixparseFn:prefixParseFn)=>void;
    registerinfix:(type:string,infixFn:infixParseFn)=>void;
    parseExpression: (precedence: number)=>Expression;
    parseIdent:()=>Expression;
    parseInteger:()=>Expression;
    parsePrefixExpression:()=>Expression;
    parseInfixExpression:(exp:Expression)=>Expression;
    noPrefixParseError:(type:string)=>void;
    peekPrecendence:()=>number;
    curPrecendence:()=>number;
    parseBoolean:()=>Expression;
}
export function createParser(lexer : lexer):Parser{
    let p : Parser ={
        lex: lexer,
        errors:[],
        prefixParseFns:new Map(),
        infixParseFns:new Map(),
        nextToken() {
            this.curToken=this.peekToken;
            this.peekToken=this.lex.nextToken();
        },
        parseProgram() {
            let pr = createProgram();
            while(this.curToken.type!==TokenType.Eof){
                let stmt = this.parseStatement();
                if(stmt !==undefined){
                    pr.statements.push(stmt);
                }
                this.nextToken();
            }
            return pr;   
        },
        parseStatement():expressionStatement| LetStatement | returnStatement | undefined {
            if(this.curToken?.type===TokenType.Let){
                let stmt=this.parseLetStatement();
                return stmt;
            }
            else if(this.curToken?.type===TokenType.Return){
                let stmt=this.parseReturnStatement();
                return stmt;
            }
            return this.parseExpressionStatement();
        },
        parseLetStatement() {
            let stmt= createLetStatement(this.curToken);
            if(!this.expectPeek(TokenType.Ident)){
                return undefined;
            }
            stmt.name=createIdentifier(this.curToken,this.curToken.literal);
            if(!this.expectPeek(TokenType.Assign)){
                return undefined;
            }
            while(!curTokenIs(this,TokenType.Semicolon)){
                this.nextToken();
            }
            return stmt;
        },
        parseReturnStatement(){
            let stmt = createReturnStatement(this.curToken);
            this.nextToken();
            while(!curTokenIs(this,TokenType.Semicolon)){
                this.nextToken();
            }
            return stmt;
        },
        expectPeek(token : string) {
            if(peekTokenIs(this,token)){
                this.nextToken();
                return true
            }
            else{
                this.peekError(token);
                return false;
            }
        },
        peekError(token) {
            let err=`expected next token to be ${token} got ${this.peekToken.type} instead`;
            console.log(err);
            this.errors.push(err);
        },
        noPrefixParseError(type) {
            let msg = `no perfix parser function for ${type} found`;
            console.log(msg);
            this.errors.push(msg);
        },
        registerPrefix(type, prefixparseFn) {
            this.prefixParseFns.set(type,prefixparseFn);
        },
        registerinfix(type, infixFn) {
            this.infixParseFns.set(type,infixFn);
        },
        parseExpressionStatement() {
            if(this.curToken.type===TokenType.Semicolon)
                return undefined;
            let stmt=createExpressionStatement(this.curToken);
            stmt.expression=this.parseExpression(ex.LOWEST);
            return stmt;
        },
        parseExpression(precedence) {
            let prefix=this.prefixParseFns.get(this.curToken.type);
            if(prefix===undefined){
                this.noPrefixParseError(this.curToken.type);
                return undefined;
            }
            let leftExp=prefix();
            while(!peekTokenIs(this,TokenType.Semicolon) && precedence < this.peekPrecendence()){
                let infix=this.infixParseFns.get(this.peekToken.type);
                if(infix==undefined)
                    return leftExp;
                this.nextToken();
                leftExp=infix(leftExp);
            }
            return leftExp;
        },
        parseIdent(){
            return createIdentifier(this.curToken,this.curToken.literal);
        },
        parseInteger(){
            let int = createIntegralLiteral(this.curToken,parseInt(this.curToken.literal));
            return int;
        },
        parsePrefixExpression() {
            let expression:prefixExpression=createPrefixExpression(this.curToken,this.curToken.literal);
            console.log(this.curToken.type+"bef");
            this.nextToken();
            console.log(this.curToken.type+"aft");
            expression.right=this.parseExpression(ex.PREFIX);
            return expression;
        },
        peekPrecendence() {
            let p = precedences[this.peekToken.type];
            if(p>0) return p;
            return ex.LOWEST;
        },
        curPrecendence() {
            let p = precedences[this.curToken.type];
            if(p>0) return p;
            return ex.LOWEST;
        },
        parseInfixExpression(expr) {
            let exp =createInfixExpression(this.curToken,this.curToken.literal,expr);
            let prec=this.curPrecendence();
            this.nextToken();
            exp.right=this.parseExpression(prec);
            return exp;
        },
        parseBoolean(): Expression{
            return createBooleanLiteral(this.curToken,this.curToken.literal=="true");
        }

    }
    p.nextToken();
    p.nextToken();
    
    let parseI=p.parseIdent.bind(p);
    p.registerPrefix(TokenType.Ident,parseI);
    p.registerPrefix(TokenType.Int,p.parseInteger.bind(p));
    p.registerPrefix(TokenType.Int,p.parseInteger.bind(p));
    p.registerPrefix(TokenType.False,p.parseBoolean.bind(p));
    p.registerPrefix(TokenType.True,p.parseBoolean.bind(p));
    p.registerPrefix(TokenType.Bang,p.parsePrefixExpression.bind(p));
    p.registerPrefix(TokenType.Minus,p.parsePrefixExpression.bind(p));
    p.registerinfix(TokenType.Eq,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Not_eq,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Plus,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Minus,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Asterisk,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Slash,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Gt,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Lt,p.parseInfixExpression.bind(p));
    return p;
}
let lex:lexer =new lexer(`3 > 5 == false`);
let par=createParser(lex);
let pr=par.parseProgram();
pr.statements.forEach(e => console.log(e));
pr.to_string()




