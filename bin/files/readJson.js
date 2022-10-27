const fs = require('fs');

function readJsonFile(path) {
    let fileContent = fs.readFileSync(path, 'utf8');
    let fileContentAsJson = JSON.parse(fileContent);
    return fileContentAsJson;
}
module.exports = readJsonFile;