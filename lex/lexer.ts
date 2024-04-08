import { TokenType,Token, createToken, keywords } from "../lexer/token";
export class lexer{
    input:string;
    position:number=0;
    readPosition:number=0;
    ch!:string;
    constructor(input : string){
        this.input=input;
        this.readChar();
    }
    public readChar(){
        if(this.readPosition>=this.input.length)
            this.ch='\0';
        else 
            this.ch=this.input[this.readPosition];
        this.position=this.readPosition;
        this.readPosition+=1;
    }
    public nextToken() :Token{
        let token: Token | undefined;
        this.skipWhiteSpace();
        switch(this.ch){
            case "=":
                if(this.peek()==="="){
                    token=createToken(TokenType.Eq,this.ch+"=")
                    this.readChar();
                }
                else
                token=createToken(TokenType.Assign,this.ch)
                break;
            case ";":
                token=createToken(TokenType.Semicolon,this.ch)
                break;
            case "(":
                token=createToken(TokenType.Lparen,this.ch)
                break;
            case ")":
                token=createToken(TokenType.Rparen,this.ch)
                break;
            case "+":
                token=createToken(TokenType.Plus,this.ch)
                break;
            case "{":
                token=createToken(TokenType.Lbrace,this.ch)
                break;
            case "}":
                token=createToken(TokenType.Rbrace,this.ch)
                break;
            case "-":
                token=createToken(TokenType.Minus,this.ch)
                break;
            case "!":
                if(this.peek()==="="){
                    token=createToken(TokenType.Not_eq,this.ch+"=")
                    this.readChar();
                }
                else
                token=createToken(TokenType.Bang,this.ch)
                break;
            case "*":
                token=createToken(TokenType.Asterisk,this.ch)
                break;
            case "/":
                token=createToken(TokenType.Slash,this.ch)
                break;
            case ",":
                token=createToken(TokenType.Comma,this.ch)
                break;
            case "<":
                token=createToken(TokenType.Lt,this.ch)
                break;
            case ">":
                token=createToken(TokenType.Gt,this.ch)
                break;
            case '\0':
                token = createToken(TokenType.Eof,"");
                break;
            default:
                if(this.isLetter(this.ch)){
                    let key=this.readIdentifier();
                    if(this.checkInKey(key)){
                        let f:Token=(keywords as any)[key];
                        token = createToken(f.type,key);
                        return token;
                    }
                    else {
                        token = createToken(TokenType.Ident,key);
                        return token;
                    }
                }
                else if(this.isNumber()){
                    token=createToken(TokenType.Int,this.readInt())
                }

                else{
                    token = createToken(TokenType.Illegal,this.ch);
                }
        }       
        this.readChar();
        return token;
    }

    public readIdentifier(): string{
       let position=this.position;
       while(this.isLetter(l.ch)){
           this.readChar();
       } 
       return this.input.substring(position,this.position);    
    }

    public isLetter(ch:string): boolean{
        return  ch.match(/[a-zA-Z_]/i)!==null;
    }

    public readInt(): string{
        const position = this.position;
        while (this.isNumber()) {
            this.readChar();
        }
       return this.input.substring(position,this.position);    
    }
    public isNumber(){
        return this.ch.match(/[0-9]/i)!==null;
    }
    public skipWhiteSpace(){
        while(this.ch===" " || this.ch==="\t" || this.ch==="\n" ||this.ch==="\r")
            this.readChar();
    }

    public checkInKey(key:string):boolean{
        return key in keywords;
    }

    public peek(): string{
        if (this.readPosition>= this.input.length) {
            return '\0';
        } else {
            return this.input[l.readPosition]
        }
    }
}
let test=`let five = 5;
let ten = 10;
let add = fn(x, y) {
x + y;
};
let result = add(five, ten);
!-/*5;
5 < 10 > 5;
if (5 < 10) {
return true;
} else {
return false;
}
10 == 10;
10 != 9;
`
let l= new lexer(test);
const token = l.nextToken()
 while (true) {
        const token = l.nextToken()
        console.log(token);
        if (token.type === "EOF") {
            break;
        }
    }
