const fs = require('fs');
function readConfig(path) {
    let fileContent = fs.readFileSync(path, 'utf8');
    let contentAsJson = JSON.parse(fileContent);
    return contentAsJson;
}