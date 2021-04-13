class File {
    constructor(fileName, size) {
        const parts = fileName.split(".");
        const extension = parts.pop();
        const name = parts.join(".");
        [this.name, this.extension] = [name, extension];
        this.size = size;
    }
}

module.exports = File;
