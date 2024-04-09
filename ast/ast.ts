import fs from "fs";
import { Token, createToken } from "../lexer/token";

export interface Node {
    tokenLiteral : ()=>string|undefined;
    to_string:()=>string;
}
export interface Statement extends Node{
    StatementNode : ()=>void|undefined;
}
export interface Expression extends Node{
    expressionNode : ()=>void;
}
export interface Program extends Node {
    statements : Statement[];
}
export interface LetStatement extends Statement{
    token: Token;
    name : Identifier;
    value : Expression;
}
export interface returnStatement extends Statement{
    token:Token;
    returnValue :Expression;
}
export interface expressionStatement extends Statement{
    token : Token;
    expression : Expression;
}
export interface Identifier extends Expression{
    token : Token;
    value:string;
}
export function createProgram() : Program{
    let program : Program ={
        statements : [],
        tokenLiteral()  {
            if(this.statements.length>0)
                return this.statements[0].tokenLiteral();
            else 
                return "";
        },
        to_string() {
            fs.writeFile("buf.txt","",'utf8',()=>console.log("."));
            this.statements.forEach(e=> {
                fs.appendFile("buf.txt",e.to_string()+`\n`,'utf8',()=>console.log("."));
            })
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
        to_string() {
            return this.value;
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
        to_string() {
            let s:string="";
            s= s+" "+this.tokenLiteral()+" "+ this.name.to_string();
            if(this.value!==undefined)
                s=s+this.value.to_string();
            s+=";";
            return s;
        },
    }
    return ls;
}
export function createReturnStatement(token:Token){
    let rs :returnStatement ={
        token:token,
        StatementNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s:string="";
            s=s+this.tokenLiteral();
            if(this.returnValue!==undefined)
                s+=this.returnValue.to_string();
            s+=";";
            return s;
        },
    }
    return rs;
}

export function createExpressionStatement(token:Token){
    let es :expressionStatement ={
        token:token,
        StatementNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s:string="";
            s=s+this.tokenLiteral();
            if(this.expression!==undefined)
                s+=this.expression.to_string();
            s+=";";
            return s;
        },
    }
    return es;
}





