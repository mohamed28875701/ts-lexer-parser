import { Token, createToken } from "../lexer/token";

export interface Node {
    tokenLiteral : ()=>string|undefined;
}
export interface Statement extends Node{
    StatementNode : ()=>void|undefined;
}
export interface Expression extends Node{
    expressionNode : ()=>void;
}
export type Program ={
    statements : Statement[];
    TokenLiteral : ()=>string|undefined;
}
export interface LetStatement extends Statement{
    token: Token;
    name : Identifier;
    value : Expression;
}
export interface Identifier extends Expression{
    token : Token;
    value:string;
}
export function createProgram() : Program{
    let program : Program ={
        statements : [],
        TokenLiteral()  {
            if(this.statements.length>0)
                return this.statements[0].tokenLiteral();
            else 
                return "";
        },
    }
    return program;
}
export function createIdentifier(token : Token,value:string) : Identifier{
    let id : Identifier={
        token : token,
        value:value,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token?.literal;
        },
    }
    return id;
}
export function createLetStatement(token:Token) : LetStatement{
    let ls : LetStatement={
        token: token,
        StatementNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
    }
    return ls;
}

