const fs = require("fs");
const path = require("path");

const fileReader = require("./file_reader");

const outputDir = path.join(process.cwd(), "outputs");

function createOutputFileName(dir, depth) {
    const dirName = dir.split(path.sep).pop();
    const timeStamp = Number(new Date());
    if (!fileReader.isDirValid(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    return path.join(outputDir, `${dirName}_${depth}_${timeStamp}.json`);
}

module.exports = {
    createJSON(dir, depth) {
        const outputPath = createOutputFileName(dir, depth);
        const structure = fileReader.getDirectoryStructure(dir, depth);
        fs.writeFileSync(outputPath, JSON.stringify(structure, null, 4));
    }
};
