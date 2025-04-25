/**
 * unpacks each instruction into its underlying fields 
 */

import fs from 'fs'
import readline from 'readline'


enum InstType {
    'AInst' = 'AInst',
    'CInst' = 'CInst'
}

type CInst = {
    comp: string
    dest: string
    jump?: string
    _tag: InstType.CInst
}

type AInst = {
    label: string
    _tag: InstType.AInst
}

export class Parser {

    private filename: string
    private commandCounter = 0

    constructor(filename: string) {
        this.filename = filename
    }


    async readFileLineByLine(lineProcessor: (line: string) => void) {
        return new Promise(resolve => {
            this.commandCounter = 0
            const rl = readline.createInterface({
                input: fs.createReadStream(this.filename),
                crlfDelay: Infinity,
            });

            rl.on('line', (l) => {
                const line = l.trim()
                if (this.shouldIgnoreLine(line)) return
                lineProcessor(line)
            });

            rl.on('close', () => {
                console.log('File reading done')
                resolve('Done')
            });
        })
    }

    public processLabels(labelProcessor: (label: string, currentLine: number) => void) {
        return this.readFileLineByLine(line => {
            if (line.startsWith('(')) {
                // Label
                return labelProcessor(line.replace(/[()]/g, ""), this.commandCounter) // We shold take the address of the next command
            }
            this.commandCounter++;
        })
    }

    public processCommand(
        commandProcessor: (command: AInst | CInst) => void,
    ) {
        return this.readFileLineByLine(line => {
            if (this.isLabel(line)) return
            const instType = this.getInstructionType(line)
            if (instType === InstType.AInst) {
                const command: AInst = {
                    _tag: InstType.AInst,
                    label: this.label(line)
                }
                commandProcessor(command)
            }
            else {
                const command: CInst = {
                    comp: this.comp(line),
                    dest: this.dest(line),
                    jump: this.jump(line),
                    _tag: InstType.CInst
                }
                commandProcessor(command)
            }
            this.commandCounter++;
        })
    }


    private comp(command: string): string {
        if (!command.includes('=')) {
            return command.split(';').at(0)
        }
        const [destComp] = command.split(';')
        const [, comp] = destComp.split('=')
        return comp || ''
    }
    private isLabel(line: string) {
        return line.startsWith('(')
    }
    private dest(command: string): string {
        if (!command.includes('=')) {
            return ''
        }
        const [dest,] = command.split('=')
        return dest || ''
    }
    private jump(command: string): string {
        const [, jump] = command.split(';')
        return jump?.trim() || ''
    }
    private label(command: string) {
        return command.split('@').at(1)
    }
    private shouldIgnoreLine(line: string) {
        const startsWith = line.at(0)

        switch (startsWith) {
            // comment
            case '/':
            // empty line
            case undefined:
                return true
            default:
                return false
        }
    }
    private getInstructionType(instruction: string): InstType {
        if (instruction.startsWith('@')) return InstType.AInst
        else return InstType.CInst
    }

}
