import { Expression, Identifier, LetStatement, Program, Statement, blockStatement, callExpression, createBlockStatement, createBooleanLiteral, createCallExpression, createExpressionStatement, createFunctionLiteral, createIdentifier, createIfExpression, createInfixExpression, createIntegralLiteral, createLetStatement, createPrefixExpression, createProgram, createReturnStatement, ex, expressionStatement, functionLiteral, ifExpression, precedences, prefixExpression, returnStatement } from "../ast/ast";
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
    parseGroupedExpressions:()=>Expression|undefined;
    parseIfEpression:()=>ifExpression|undefined;
    parseBlockStatement:()=>blockStatement|undefined;
    parseParams:()=>Identifier[];
    parseFunctionExpression:()=> functionLiteral|undefined;
    parseCallArgs:()=>Expression[];
    parseCallExpression:(fn:Expression)=>callExpression;
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
            this.nextToken();
            stmt.value=this.parseExpression(ex.LOWEST);
            if(peekTokenIs(this,TokenType.Semicolon))
                this.nextToken();
            return stmt;
        },
        parseReturnStatement(){
            let stmt = createReturnStatement(this.curToken);
            this.nextToken();
            stmt.returnValue=this.parseExpression(ex.LOWEST);
            if(peekTokenIs(this,TokenType.Semicolon))
                this.nextToken();
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
        },
        parseGroupedExpressions(): Expression | undefined {
            this.nextToken();
            let exp:Expression=this.parseExpression(ex.LOWEST);
            if(!this.expectPeek(TokenType.Rparen))
                return undefined
            return exp;
        },
        parseBlockStatement() {
            let block = createBlockStatement(this.curToken);
            this.nextToken();
            while(!curTokenIs(this,TokenType.Rbrace) && !curTokenIs(this,TokenType.Rbrace)){
                let stmt=this.parseStatement();
                if(stmt!==undefined)
                    block.statements.push(stmt);
                this.nextToken();
            };
            return block;
        },
        parseIfEpression() {
            let ie=createIfExpression(this.curToken);
            if(!this.expectPeek(TokenType.Lparen)){
                return undefined;
            }
            this.nextToken();
            ie.condition=this.parseExpression(ex.LOWEST);
            if(!this.expectPeek(TokenType.Rparen)){
                return undefined;
            }
            if(!this.expectPeek(TokenType.Lbrace)){
                console.log("hey");
                return undefined;
            }
            ie.consequence=this.parseBlockStatement();
            if(peekTokenIs(this,TokenType.Else)){
                this.nextToken();
                if(!this.expectPeek(TokenType.Lbrace)){
                    return undefined;
                }
                ie.alternative=this.parseBlockStatement();
            }
            return ie;
        },
        parseParams() {
            let params:Identifier[]=[];
            if(peekTokenIs(this,TokenType.Rparen))
                return params;
            this.nextToken();
            let id=createIdentifier(this.curToken,this.curToken.literal);
            params.push(id);
            while (peekTokenIs(this,TokenType.Comma)){
                this.nextToken();
                this.nextToken();
                id=createIdentifier(this.curToken,this.curToken.literal);
                params.push(id);
            };
            if(!this.expectPeek(TokenType.Rparen))
                return undefined;
            return params;
        },
        parseFunctionExpression() {
            let fn=createFunctionLiteral(this.curToken);
            if(!this.expectPeek(TokenType.Lparen))
                return undefined;
            fn.params=this.parseParams();
            if(!this.expectPeek(TokenType.Lbrace))
                return undefined;
            fn.body=this.parseBlockStatement();
            return fn;
        },
        parseCallArgs() {
            let args:Expression[]=[];
            if(peekTokenIs(this,TokenType.Rparen)){
                this.nextToken();
                return args;
            }
            this.nextToken();
            args.push(this.parseExpression(ex.LOWEST));
            while(peekTokenIs(this,TokenType.Comma)){
                this.nextToken();
                this.nextToken();
                args.push(this.parseExpression(ex.LOWEST));
            };
            if(!this.expectPeek(TokenType.Rparen))
                return undefined;
            return args;
        },
        parseCallExpression(fn) {
            let ce:callExpression=createCallExpression(this.curToken,fn);
            ce.arguments=this.parseCallArgs();
            return ce;
        },
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
    p.registerPrefix(TokenType.Lparen,p.parseGroupedExpressions.bind(p));
    p.registerPrefix(TokenType.If,p.parseIfEpression.bind(p));
    p.registerPrefix(TokenType.Function,p.parseFunctionExpression.bind(p));
    p.registerinfix(TokenType.Eq,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Not_eq,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Plus,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Minus,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Asterisk,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Slash,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Gt,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Lt,p.parseInfixExpression.bind(p));
    p.registerinfix(TokenType.Lparen,p.parseCallExpression.bind(p));
    return p;
}
let lex:lexer =new lexer('let x = 5;');
let par=createParser(lex);
let pr=par.parseProgram();
pr.statements.forEach(e => console.log(e));
pr.to_string()




