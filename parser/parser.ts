import { LetStatement, Program, Statement, createIdentifier, createLetStatement, createProgram } from "../ast/ast";
import { lexer } from "../lex/lexer";
import { Token, TokenType } from "../lexer/token";
import { curTokenIs, peekTokenIs } from "./helper_functions";

export interface Parser{
    lex : lexer;
    curToken : Token;
    peekToken : Token;
    errors:string[],
    nextToken : ()=> void;
    parseProgram:()=>Program;
    parseStatement:()=>LetStatement|undefined;
    parseLetStatement:()=>LetStatement|undefined;
    expectPeek:(token:string)=>boolean;
    peekError:(token:string)=>void;
}
export function createParser(lexer : lexer):Parser{
    let p : Parser ={
        lex: lexer,
        errors:[],
        nextToken() {
            this.curToken=this.peekToken;
            this.peekToken=this.lex.nextToken();
        },
        parseProgram() {
            let pr = createProgram();
            let i =0;
            while(this.curToken.type!==TokenType.Eof){
                let stmt = this.parseStatement();
                if(stmt !==undefined){
                    pr.statements.push(stmt);
                }
                this.nextToken();
            }
            return pr;   
        },
        parseStatement() {
            if(this.curToken?.type===TokenType.Let){
                let stmt=this.parseLetStatement();
                return stmt;
            }
            else 
                return undefined;
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
    }
    p.nextToken();
    p.nextToken();
    return p;
}
let lex:lexer =new lexer(`
let x = 5;
let y = 10;
let z = 838383;
`
);
let par=createParser(lex);
let pr=par.parseProgram();
pr.statements.forEach(e => console.log(e));






