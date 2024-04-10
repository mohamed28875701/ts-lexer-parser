"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
/*function readFile(file:string):string{
    const data = fs.readFileSync(file,"utf8");
    return data;
}
const data : string=readFile("file.txt").toString();
let l : lexer=new lexer(data);
fs.writeFile("out.txt",'',()=>console.log("done"));
console.log(data);
for(let i=0 ; i!=l.input.length;i++) {
    const token = l.nextToken()
    fs.appendFileSync("out.txt",`${token.type} ${token.literal}\n`,"utf8")
    if(token.type===TokenType.Eof)
        break;
}*/
readline_1.default.emitKeypressEvents();
