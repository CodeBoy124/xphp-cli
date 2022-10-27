const fs = require('fs');
const path = require('path');
function readConfig(cwd) {
    let configFilePath = path.join(cwd, "xphpconfig.json");
    let fileContent = '{"useInlineXphp": true, "tags": ["default"], "xphpFileExtension": ".xphp", "phpFileExtension": ".php"}';
    if (fs.existsSync(configFilePath)) {
        fileContent = fs.readFileSync(configFilePath, 'utf8');
    }
    let contentAsJson = JSON.parse(fileContent);
    return contentAsJson;
}
module.exports = readConfig;