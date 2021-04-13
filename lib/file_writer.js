const fs = require("fs");
const path = require("path");

const fileReader = require("./file_reader");

function createOutputFileName(dir, depth) {
    const dirName = dir.split(path.sep).pop();
    const timeStamp = Number(new Date());
    return `outputs/${dirName}_${depth}_${timeStamp}.json`;
}

module.exports = {
    createJSON(dir, depth) {
        const outputPath = createOutputFileName(dir, depth);
        const structure = fileReader.getDirectoryStructure(dir, depth);
        fs.writeFileSync(outputPath, JSON.stringify(structure, null, 4));
    }
};
