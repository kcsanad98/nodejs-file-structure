const fs = require("fs")
const path = require("path")

const file_reader = require("./file_reader")

module.exports = {
    createJSON(dir, depth) {
        const outputPath = createOutputFileName(dir, depth)
        const structure = file_reader.getDirectoryStructure(dir, depth)
        fs.writeFileSync(outputPath, JSON.stringify(structure, null, 4))
    }
}

function createOutputFileName(dir, depth) {
    const dirName = dir.split(path.sep).pop()
    const timeStamp = new Number(new Date())
    return `outputs/${dirName}_${depth}_${timeStamp}.json`
}
