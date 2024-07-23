const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const uploadFolder = path.join(process.cwd(), `public/uploads`)

const getFileSize = (fileName) => {
    if(!fileName) {
        return 0
    } else if(fileName.includes('http://') || fileName.includes('https://')){
        return 0
    } else {
        try {
            const fullPath = `${uploadFolder}/${fileName}`
            var stats = fs.statSync(fullPath);
            return _.get(stats, ['size'], 0)
        } catch (err) {
            return 0
        }
    }

    return 0
}

const bytesToMegabytes = (bytes) => {
    if(!bytes){
        return 0
    } else {
        return bytes / (1024 * 1024)
    }
}

module.exports = {
    getFileSize,
    bytesToMegabytes
}