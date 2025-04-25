/**
 * unpacks each instruction into its underlying fields 
 */

import fs from 'fs'
import path from 'path'
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
    private rl: readline.Interface
    async open(filename: string) {
        const filePath = path.resolve(process.cwd(), filename)
        const fileStream = fs.createReadStream(filePath)
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        })
        this.rl = rl
    }

    public close() {
        this.rl.close
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

    async processCommand(processor: (command: AInst | CInst) => void) {
        this.rl.on('line', (line) => {
            if (this.shouldIgnoreLine(line)) return

            const instType = this.getInstructionType(line)
            if (instType === InstType.AInst) {
                const command: AInst = {
                    _tag: InstType.AInst,
                    label: this.label(line)
                }
                processor(command)
            }
            else {
                const command: CInst = {
                    comp: this.comp(line),
                    dest: this.dest(line),
                    jump: this.jump(line),
                    _tag: InstType.CInst
                }
                processor(command)
            }
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


    private getInstructionType(instruction: string): InstType {
        if (instruction.startsWith('@')) return InstType.AInst
        else return InstType.CInst
    }

}
