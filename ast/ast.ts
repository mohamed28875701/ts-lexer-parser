import { Token } from "../lexer/token";

interface Node {
    tokenLiteral : ()=>void;
}
interface Statement extends Node{
    StatementNode : ()=>void;
}
interface Expression extends Node{
    expressionNode : ()=>void;
}
type Program ={
    statements : Statement[];
}
let program : Program={statements : []};
program.statements.forEach(e => e.tokenLiteral = () => {
    if(program.statements.length>0){
        return program.statements[0].tokenLiteral();
    }
    else {
        return "";
    }
})
interface LetStatement extends Statement{
    token: Token;
    name : Identifier;
    value : Expression;
}
interface Identifier extends Expression{
    token : Token;
    value:string;
    tokenLiteral : ()=>{return this.token.literal}
}

