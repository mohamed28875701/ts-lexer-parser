import fs from 'fs'
import { lexer } from './lex/lexer';
function readFile(file:string):string{
    const data = fs.readFileSync(file,"utf8");
    return data;
}
let l : lexer=new lexer(readFile("file.txt"));
const token = l.nextToken()
 while (true) {
        if (token.type !== "EOF") {
            const token = l.nextToken()
            console.log(token);
            //fs.appendFile("out.txt",`${token.type} ${token.literal}\n`,'utf8',(e)=>console.log("deez nuts"));
        }
        break;
}
