/**
 * initializes the I/O files and drives the process
 */

import { Code } from './Code'
import { Parser } from './Parser'

const asmToCompile = process.argv[2]

if (!asmToCompile) {
    throw new Error("Please provide a filename to compile")
}


const parser = new Parser()
const binaryExtractor = new Code()

parser.open(asmToCompile)
parser.processCommand((command) => {
    if (command._tag === 'AInst') {
        const ll = command.label
        const labelBin = binaryExtractor.label(command.label)
        console.log({ command })
    } else {
        const dd = binaryExtractor.dest(command.dest)
        const jj = binaryExtractor.jump(command.jump)
        const cc = binaryExtractor.comp(command.comp)
        console.log({ command })
        const binaryCode = `111${cc}${dd}${jj}`
        console.log(binaryCode, 'binaryCode')
        // write to file
    }

})