const { isDirValid } = require("./file_reader");

let dir;
let depth;

function isDirProvided() {
    return dir !== undefined;
}

function isDepthProvided() {
    return depth !== undefined;
}

function getValidDepth(input) {
    let result = parseInt(input, 10);
    if (input === "") {
        result = Infinity;
    }
    return Number.isNaN(result) || result < 0 ? false : result;
}

function handleDepthInput(input) {
    const depthInput = getValidDepth(input);
    if (depthInput === false) {
        console.log(
            "Depth must be a positive integer. Please provide a valid value:"
        );
    } else {
        depth = depthInput;
    }
}

function handleDirInput(input) {
    if (isDirValid(input)) {
        dir = input;
        console.log(
            "Depth of search (if not specified the largest possible depth will be used):"
        );
    } else {
        console.log("The provided path is invalid. Please enter a valid path:");
    }
}

function chunkToString(chunk) {
    return chunk.toString("utf-8").trim();
}

module.exports = {
    getUserInput: callback => {
        console.log("Path of the directory:");
        process.stdin.on("data", chunk => {
            const input = chunkToString(chunk);
            if (!isDirProvided()) {
                handleDirInput(input);
            } else {
                handleDepthInput(input);
            }
            if (isDirProvided() && isDepthProvided()) {
                callback(dir, depth);
                process.stdin.pause();
            }
        });
    }
};
