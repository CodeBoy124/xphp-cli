const fs = require('fs');

function replaceXphpWithPhp(xphpFileName) {
    let nameWithoutXphp = xphpFileName.slice(0, -5);
    let phpName = nameWithoutXphp + ".php";
    return phpName;
}
function addPhpFile(xphpFileName, fileContent) {
    let realFileName = replaceXphpWithPhp(xphpFileName);
    fs.writeFileSync(realFileName, fileContent);
}
module.exports = addPhpFile;