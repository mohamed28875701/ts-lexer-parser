import { lexer } from "../lex/lexer";
import { Token } from "../lexer/token";

export interface Parser{
    lex : lexer;
    curToken? : Token;
    peekToken? : Token;
    nextToken : ()=> void;
}
export function createParser(lexer : lexer){
    let p : Parser ={
        lex: lexer,
        nextToken() {
            this.curToken=this.peekToken;
            this.peekToken=this.lex.nextToken();
        },
    }
    p.nextToken();
    p.nextToken();
    return p;
}
let l : lexer = new lexer("let x = 3;");
let p = createParser(l);
console.log(p.peekToken);
console.log(p.curToken);
