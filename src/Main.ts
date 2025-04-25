/**
 * initializes the I/O files and drives the process
 */

import fs, { writeFileSync, appendFileSync } from 'fs'
import { Code } from './Code'
import { Parser } from './Parser'

const asmToCompile = process.argv[2]

if (!asmToCompile) {
    throw new Error("Please provide a filename to compile")
}

fs.writeFileSync

const parser = new Parser()
const binaryExtractor = new Code()
const outputFileName = asmToCompile.split('.')[0] + '.hack'
writeFileSync(outputFileName, '')

parser.open(asmToCompile)
parser.processCommand((command) => {
    console.log({ command })
    let output = ''
    if (command._tag === 'AInst') {
        const labelBin = binaryExtractor.label(command.label)
        output = labelBin
    } else {
        const dd = binaryExtractor.dest(command.dest)
        const jj = binaryExtractor.jump(command.jump)
        const cc = binaryExtractor.comp(command.comp)
        output = `111${cc}${dd}${jj}`
    }
    fs.appendFileSync(outputFileName, output + '\n')
})
parser.close()