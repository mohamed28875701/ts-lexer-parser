import { Parser } from "./parser";

export function curTokenIs(parser:Parser,token:string):boolean{
    return parser.curToken.type===token;
}

export function peekTokenIs(parser:Parser,token:string):boolean{
    return parser.peekToken?.type===token;
}

