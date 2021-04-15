const fs = require("fs");
const path = require("path");

const File = require("../model/file");
const Directory = require("../model/directory");

let maxDepth = 0;

function getRootDirectoryName(dir) {
    const basename = path.basename(dir);
    return basename === "." ? path.basename(process.cwd()) : basename;
}

function recursiveSearch(root, currentDepth, done) {
    const results = [];
    fs.readdir(root, (err1, fileList) => {
        if (err1) {
            done(err1);
        }
        let pending = fileList.length;
        if (!pending) {
            done(null, new Directory(root, results));
        }
        fileList.forEach(currentEntry => {
            const currentEntryPath = path.resolve(root, currentEntry);
            fs.stat(currentEntryPath, (err2, stat) => {
                if (err2) {
                    done(err2);
                }
                if (stat && stat.isDirectory()) {
                    if (currentDepth < maxDepth) {
                        recursiveSearch(currentEntryPath, currentDepth + 1, (err3, res) => {
                            if (err3) {
                                done(err3);
                            }
                            results.push(new Directory(currentEntry, res));
                            if (!--pending) {
                                done(null, results);
                            }
                        });
                    } else {
                        done(null, results);
                    }
                } else {
                    results.push(new File(currentEntry, stat.size));
                    if (!--pending) {
                        done(null, results);
                    }
                }
            });
        });
    });
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

    getDirectoryStructure: (dir, depth, callback) => {
        if (depth > 0) {
            maxDepth = depth;
            recursiveSearch(dir, 1, (err, res) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                const structure = new Directory(getRootDirectoryName(dir), res);
                callback(dir, depth, structure);
            });
        }
    }
};
