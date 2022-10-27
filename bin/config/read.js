const fs = require('fs');
const path = require('path');
function readConfig(cwd) {
    let fileContent = fs.readFileSync(path.join(cwd, "xphpconfig.json"), 'utf8');
    let contentAsJson = JSON.parse(fileContent);
    return contentAsJson;
}
module.exports = readConfig;