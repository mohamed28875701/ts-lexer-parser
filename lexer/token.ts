export const TokenType ={
    Illegal:"Illegal",
    Eof:"EOF",
    Ident:"ident",
    Int:"int",
    Assign:"=",
    Comma : ",",
    Semicolon : ";",
    Lparen : "(",
    Rparen : ")",
    Lbrace : "{",
    Rbrace : "}",
    // Keywords,
    Function : "fn",
    Let : "LET",
    Plus : "+",
    Minus : "-",
    Bang : "!",
    Asterisk : "*",
    Slash : "/",
    Lt : "<",
    Gt : ">",
    True : "TRUE",
    False : "FALSE",
    If : "IF",
    Else : "ELSE",
    Return : "RETURN",
    Eq : "==",
    Not_eq : "!=",

} as const;
    type TokenItem = typeof TokenType[keyof typeof TokenType];

export type Token = {
    type : TokenItem;
    literal:string;
}

export const keywords= {
    "fn":createToken(TokenType.Function,"fn"),
    "let":createToken(TokenType.Let,"let"),
    "true":createToken(TokenType.True,"true"),
    "false":createToken(TokenType.False,"false"),
    "if":createToken(TokenType.If,"if"),
    "else":createToken(TokenType.Else,"else"),
    "return":createToken(TokenType.Return,"return"),
}as const;

export function createToken(type: TokenType , literal : string): Token{
    let t : Token = {
        type:type,
        literal:literal
    }
    return t;
}
