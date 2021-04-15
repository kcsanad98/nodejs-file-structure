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

function writeOutputFile(dir, depth, content) {
    const outputPath = createOutputFileName(dir, depth);
    fs.writeFile(outputPath, JSON.stringify(content, null, 4), () =>
        console.log(`Created ${outputPath}`)
    );
}

module.exports = {
    createJSON: (dir, depth) => {
        fileReader.getDirectoryStructure(dir, depth, writeOutputFile);
    }
};
