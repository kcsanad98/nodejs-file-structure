const { isDirValid } = require("./file_reader")
let dir
let depth

module.exports = {
    getUserInput: callback => {
        console.log("Path of the directory:")
        process.stdin.on("data", chunk => {
            const input = chunkToString(chunk)
            if (input === "/exit") {
                process.exit(0)
            }
            if (!isDirProvided()) {
                handleDirInput(input)
            } else {
                handleDepthInput(input)
            }
            if (isDirProvided() && isDepthProvided()) {
                callback(dir, depth)
                process.stdin.pause()
            }
        })
    },

    getDirPath: () => {
        return dir
    },

    getDepth: () => {
        return depth
    }
}

function handleDirInput(input) {
    if (isDirValid(input)) {
        dir = input
        console.log(
            "Depth of search (if not specified the largest possible depth will be used):"
        )
    } else {
        console.log("The provided path is invalid. Please enter a valid path:")
    }
}

function handleDepthInput(input) {
    const depthInput = getValidDepth(input)
    if (depthInput === false) {
        console.log("Depth must be an integer. Please provide a valid value:")
    } else {
        depth = depthInput
    }
}

function isDirProvided() {
    return dir !== undefined
}

function isDepthProvided() {
    return depth !== undefined
}

function getValidDepth(input) {
    let result
    if (input === "") {
        input = Infinity
    }
    result = parseInt(input)
    return isNaN(result) ? false : result
}

function chunkToString(chunk) {
    return chunk.toString("utf-8").trim()
}
