"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const lexer_1 = require("./lex/lexer");
const token_1 = require("./lexer/token");
function readFile(file) {
    const data = fs_1.default.readFileSync(file, "utf8");
    return data;
}
const data = readFile("file.txt").toString();
let l = new lexer_1.lexer(data);
fs_1.default.writeFile("out.txt", '', () => console.log("done"));
console.log(data);
for (let i = 0; i != l.input.length; i++) {
    const token = l.nextToken();
    fs_1.default.appendFileSync("out.txt", `${token.type} ${token.literal}\n`, "utf8");
    if (token.type === token_1.TokenType.Eof)
        break;
}
