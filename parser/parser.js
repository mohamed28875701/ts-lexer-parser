"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParser = void 0;
const lexer_1 = require("../lex/lexer");
function createParser(lexer) {
    let p = {
        lex: lexer,
        nextToken() {
            this.curToken = this.peekToken;
            this.peekToken = this.lex.nextToken();
        },
    };
    p.nextToken();
    p.nextToken();
    return p;
}
exports.createParser = createParser;
let l = new lexer_1.lexer("let x = 3;");
let p = createParser(l);
console.log(p.peekToken);
console.log(p.curToken);
