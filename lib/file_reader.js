const fs = require("fs");
const path = require("path");

const File = require("../model/file");
const Directory = require("../model/directory");

function getRootDirectoryName(dir) {
    const basename = path.basename(dir);
    return basename === "." ? process.cwd() : basename;
}

module.exports = {
    isDirValid: dirPath => {
        let result;
        try {
            result = fs.lstatSync(dirPath).isDirectory();
        } catch (err) {
            result = false;
        }
        return result;
    },

    getDirectoryStructure: (dir, depth) => {
        function recursiveSearch(root, container, currentDepth) {
            const fileList = fs.readdirSync(root);
            fileList.forEach(currentEntry => {
                const currentEntryPath = path.resolve(root, currentEntry);
                const stat = fs.statSync(currentEntryPath);
                if (stat && stat.isDirectory()) {
                    const currentDir = new Directory(currentEntry);
                    if (currentDepth < depth) {
                        recursiveSearch(
                            currentEntryPath,
                            currentDir.children,
                            currentDepth + 1
                        );
                    }
                    container.push(currentDir);
                } else {
                    const currentFile = new File(currentEntry, stat.size);
                    container.push(currentFile);
                }
            });
        }

        const rootDirName = getRootDirectoryName(dir);
        const structure = new Directory(rootDirName);
        if (depth > 0) {
            recursiveSearch(dir, structure.children, 1);
        }
        return structure;
    }
};
