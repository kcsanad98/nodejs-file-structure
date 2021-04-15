const fs = require("fs");
const path = require("path");

const File = require("../model/file");
const Directory = require("../model/directory");

let maxDepth = 0;

function getRootDirectoryName(dir) {
    const basename = path.basename(dir);
    return basename === "." ? path.basename(process.cwd()) : basename;
}

async function recursiveSearch(dir, depth) {
    if (depth > maxDepth) {
        return [];
    }
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map(dirent => {
            const direntPath = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? new Directory(direntPath) : direntPath;
        })
    );
    const structure = await Promise.all(
        files
            .map(dirent => (dirent instanceof Directory ? dirent.name : dirent))
            .map(async direntName => {
                const direntStat = await fs.promises.stat(direntName);
                const direntBaseName = path.basename(direntName);
                let result;
                if (direntStat && direntStat.isDirectory()) {
                    result = new Directory(
                        direntBaseName,
                        await recursiveSearch(direntName, depth + 1)
                    );
                } else {
                    result = new File(direntBaseName, direntStat.size);
                }
                return result;
            })
    );
    return structure;
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

    getDirectoryStructure: async (dir, depth) => {
        const result = new Directory(getRootDirectoryName(dir));
        if (depth > 0) {
            maxDepth = depth;
            result.children = await recursiveSearch(dir, 1);
        }
        return result;
    }
};
