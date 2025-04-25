import { SymbolTable } from "./SymbolTable"

/**
 * translates each field into its corresponding binary value
 */
type Command = string

const CompTable = {
    '0': '0101010',
    '1': '0111111',
    '-1': '0111010',
    'D': '0001100',
    'A': '0110000',
    '!D': '0001101',
    '!A': '0110001',
    '-D': '0001111',
    '-A': '0110011',
    'D+1': '0011111',
    'A+1': '0110111',
    'D-1': '0001110',
    'A-1': '0110010',
    'D+A': '0000010',
    'D-A': '0010011',
    'A-D': '0000111',
    'D&A': '0000000',
    'D|A': '0010101',
    'M': '1110000',
    '!M': '1110001',
    '-M': '1110011',
    'M+1': '1110111',
    'M-1': '1110010',
    'D+M': '1000010',
    'D-M': '1010011',
    'M-D': '1000111',
    'D&M': '1000000',
    'D|M': '1010101'
}
const DestTable = {
    'M': '001',
    'D': '010',
    'DM': '011',
    'MD': '011',
    'A': '100',
    'AM': '101',
    'AD': '110',
    'ADM': '111',
    'AMD': '111'
}

const JMPTable = {
    'JGT': '001',
    'JEQ': '010',
    'JGE': '011',
    'JLT': '100',
    'JNE': '101',
    'JLE': '110',
    'JMP': '111'
}
export class Code {
    private symbolTable: SymbolTable
    private availableAddress = 16

    constructor() {
        this.symbolTable = new SymbolTable()

        // Predefined R0..R15 register symbols
        for (let register = 0; register < 16; register++) {
            this.symbolTable.set(`R${register}`, register)
        }
        // Other predefined symbols
        this.symbolTable.set('SCREEN', 16384)
        this.symbolTable.set('KBD', 24576)
        this.symbolTable.set('SP', 0)
        this.symbolTable.set('LCL', 1)
        this.symbolTable.set('ARG', 2)
        this.symbolTable.set('THIS', 3)
        this.symbolTable.set('THAT', 4)
    }

    public addLabel(label: string, address: number) {
        this.symbolTable.set(label, address)
    }

    public comp(cc: Command) {
        return CompTable[cc] || CompTable['0']
    }
    public dest(dd: Command) {
        return DestTable[dd] || '000'
    }
    public jump(jj: Command) {
        return JMPTable[jj] || '000'
    }
    public label(ll: Command) {
        if (this.isNumeric(ll)) return this.to16Binary(Number(ll))

        if (this.symbolTable.has(ll)) {
            return this.to16Binary(Number(this.symbolTable.get(ll)))
        } else {
            this.symbolTable.set(ll, this.availableAddress)

            const value = this.to16Binary(Number(this.availableAddress))
            this.availableAddress++
            return value
        }
    }


    private isNumeric(str: string) {
        return /^-?\d+$/.test(str);
    }

    private to16Binary(n: number) {
        return n.toString(2).padStart(16, '0')
    }
}