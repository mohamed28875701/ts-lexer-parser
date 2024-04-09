import { Expression, Identifier, LetStatement, Program, Statement, createExpressionStatement, createIdentifier, createLetStatement, createProgram, createReturnStatement, expressionStatement, returnStatement } from "../ast/ast";
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
}
const ex={
    LOWEST:0,
    EQUALS:1,
    LESSGREATER:2,
    SUM:3,
    PRODCUT:4,
    PREFIX:5,
    CALL:6
}as const;
export function createParser(lexer : lexer):Parser{
    let p : Parser ={
        lex: lexer,
        errors:[],
        prefixParseFns:new Map(),
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
        registerPrefix(type, prefixparseFn) {
            this.prefixParseFns.set(type,prefixparseFn);
        },
        registerinfix(type, infixFn) {
            this.infixParseFns.set(type,infixFn);
        },
        parseExpressionStatement() {
            let stmt=createExpressionStatement(this.curToken);
            stmt.expression=this.parseExpression(ex.LOWEST);
            return stmt;
        },
        parseExpression(precedence) {
            let prefix=this.prefixParseFns.get(this.curToken.type);
            console.log(prefix);
            console.log(this.curToken);
            if(prefix===undefined)
                return undefined;
            let leftExp=prefix();
            return leftExp;
        },
        parseIdent(){
            return createIdentifier(this.curToken,this.curToken.literal);
        }

    }
    p.nextToken();
    p.nextToken();
    let parseI=p.parseIdent.bind(p);
    p.registerPrefix(TokenType.Ident,parseI);
    return p;
}
let lex:lexer =new lexer(`foobar;`);
let par=createParser(lex);
let pr=par.parseProgram();
pr.statements.forEach(e => console.log(e));
pr.to_string()




