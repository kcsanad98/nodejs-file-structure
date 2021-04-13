class File {
    constructor(fileName, size) {
        const parts = fileName.split(".")
        this.extension = parts.pop()
        this.name = parts.join(".")
        this.size = size
    }
}

module.exports = File
