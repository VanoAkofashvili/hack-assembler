/**
 * initializes the I/O files and drives the process
 */

import fs, { writeFileSync, appendFileSync } from 'fs'
import path from 'path'
import { Code } from './Code'
import { Parser } from './Parser'


(async function () {

    const filename = process.argv[2]
    const asmToCompile = path.resolve(process.cwd(), filename)

    if (!asmToCompile) {
        throw new Error("Please provide a filename to compile")
    }


    const parser = new Parser(asmToCompile)
    const code = new Code()
    const outputFileName = asmToCompile.split('.')[0] + '.hack'
    writeFileSync(outputFileName, '')


    // First pass - handle labels
    await parser.processLabels((label, currentLine) => {
        code.addLabel(label, currentLine)
    })



    // Second pass - handle commands
    await parser.processCommand(
        (command) => {
            let output = ''
            if (command._tag === 'AInst') {
                const labelBin = code.label(command.label)
                output = labelBin
            } else {
                const dd = code.dest(command.dest)
                const jj = code.jump(command.jump)
                const cc = code.comp(command.comp)
                output = `111${cc}${dd}${jj}`
            }
            fs.appendFileSync(outputFileName, output + '\n')
        },
    )


})()
