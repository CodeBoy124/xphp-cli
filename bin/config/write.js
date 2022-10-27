const fs = require('fs');
const path = require('path');
function writeBasicXphpConfigFile(rootFolder) {
    let basicConfig = {
        useInlineXphp: true,
        tags: ["default"],
        xphpFileExtension: ".xphp",
        phpFileExtension: ".php"
    };
    let basicConfigAsText = JSON.stringify(basicConfig, null, 2);
    console.log(basicConfigAsText);
    fs.writeFileSync(path.join(rootFolder, "xphpconfig.json"), basicConfigAsText);
}
module.exports = writeBasicXphpConfigFile;