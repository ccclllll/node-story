const fs = require('fs')


function writeFile(path, text) {
    fs.appendFileSync(path, text)
}

function readFile(path, encode) {
    return fs.readFileSync(path, encode)
}

module.exports = {
    writeFile,
    readFile
}
