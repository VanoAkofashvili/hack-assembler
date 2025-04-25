const asmToCompile = process.argv[2]

if (!asmToCompile) {
    throw new Error("Please provide a filename to compile")
}

