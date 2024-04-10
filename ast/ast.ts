import fs from "fs";
import { Token, TokenType, createToken } from "../lexer/token";

export interface Node {
    tokenLiteral : ()=>string|undefined;
    to_string:()=>string;
}
export interface Statement extends Node{
    StatementNode : ()=>void|undefined;
}

export interface Expression extends Statement{
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
    value:string;
}

export type prefixParseFn=()=>Expression;
export type infixParseFn=(exp:Expression)=>Expression;

export interface IntegralLiteral extends Expression{
    token : Token;
    value:number;
}

export interface prefixExpression extends Expression{
    token:Token;
    operator:string;
    right:Expression;
}

export interface infixExpression extends Expression{
    token:Token;
    left:Expression;
    operator:string;
    right:Expression;
}

export interface booleanLiteral extends Expression{
    token : Token;
    value:boolean;
};

export const ex={
    LOWEST:0,
    EQUALS:1,
    LESSGREATER:2,
    SUM:3,
    PRODCUT:4,
    PREFIX:5,
    CALL:6
}as const;

export const precedences : { [key :string ] :number}={
    "==":1,
    "!=" :1,
    "<":2,
    ">":2,
    "+":3,
    "-":3,
    "/":4,
    "*":4,
};

export function createInfixExpression(token : Token , operator:string,left:Expression){
    let ie:infixExpression={
        token: token,
        operator: operator,
        left:left,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s: string ="{" +this.left.to_string() + " " + this.operator + " " + this.right.to_string()+"}";
            return s;
        },
    };
    return ie;
};

export function createPrefixExpression(token : Token,operator:string) : prefixExpression{
    let pe : prefixExpression={
        token : token,
        operator:operator,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            let s="";
            s+="(" + this.operator+" "+ this.right.to_string()+")";;
            return s;
        },
    }
    return pe;
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

export function createIdentifier(token : Token,value:string) : IntegralLiteral{
    let id : Identifier={
        token : token,
        value:value,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            return this.value;
        },
    }
    return id;
}

export function createIntegralLiteral(token : Token,value:number) : Identifier{
    let id : Identifier={
        token : token,
        value:value,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
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
            s=s+this.tokenLiteral()+" ";
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
            s=s+this.tokenLiteral()+" ";
            if(this.expression!==undefined)
                s+=this.expression.to_string();
            s+=";";
            return s;
        },
    }
    return es;
}

export function createBooleanLiteral(token:Token,value:boolean){
    let bl:booleanLiteral={
        token:token,
        value:value,
        expressionNode() {
            return undefined;
        },
        tokenLiteral() {
            return this.token.literal;
        },
        to_string() {
            return this.tokenLiteral(); 
        },
    };
    return bl;
};



