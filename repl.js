"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const lexer_1 = require("./lex/lexer");
function readFile(file) {
    const data = fs_1.default.readFileSync(file, "utf8");
    return data;
}
console.log(readFile("file.txt"));
let l = new lexer_1.lexer(readFile("file.txt"));
const token = l.nextToken();
while (true) {
    if (token.type !== "EOF") {
        const token = l.nextToken();
        console.log(token);
        //fs.appendFile("out.txt",`${token.type} ${token.literal}\n`,'utf8',(e)=>console.log("deez nuts"));
    }
    break;
}
