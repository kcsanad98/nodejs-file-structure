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
    createJSON: async (dir, depth) => {
        const content = await fileReader.getDirectoryStructure(dir, depth);
        const outputPath = createOutputFileName(dir, depth);
        fs.writeFile(outputPath, JSON.stringify(content, null, 4), () =>
            console.log(`Created ${outputPath}`)
        );
    }
};
