import fs from 'fs'
import { lexer } from './lex/lexer';
import { TokenType } from './lexer/token';
function readFile(file:string):string{
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
}
