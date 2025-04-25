/**
 * manages the symbol table
 */
export class SymbolTable {
    private symbolTable: Map<string, number> = new Map()

    public get(key: string) {
        return this.symbolTable.get(key)
    }

    public set(key: string, value: number) {
        return this.symbolTable.set(key, value)
    }

    public has(key: string) {
        return this.symbolTable.has(key)
    }
}