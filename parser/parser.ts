import { LetStatement, Program, Statement, createIdentifier, createLetStatement, createProgram, createReturnStatement, returnStatement } from "../ast/ast";
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
    parseStatement:()=>LetStatement|returnStatement|undefined;
    parseLetStatement:()=>LetStatement|undefined;
    expectPeek:(token:string)=>boolean;
    peekError:(token:string)=>void;
    parseReturnStatement : ()=>returnStatement|undefined;
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
        parseStatement(): LetStatement | returnStatement | undefined {
            if(this.curToken?.type===TokenType.Let){
                let stmt=this.parseLetStatement();
                return stmt;
            }
            else if(this.curToken?.type===TokenType.Return){
                let stmt=this.parseReturnStatement();
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
    }
    p.nextToken();
    p.nextToken();
    return p;
}
let lex:lexer =new lexer(`
return 5;
return 10;
return 993322;
`
);
let par=createParser(lex);
let pr=par.parseProgram();
pr.statements.forEach(e => console.log(e));






