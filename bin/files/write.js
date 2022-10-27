const fs = require('fs');

function replaceXphpWithPhp(xphpFileName, sliceAmount, phpFileEnding) {
    let nameWithoutXphp = xphpFileName.slice(0, -sliceAmount);
    let phpName = nameWithoutXphp + phpFileEnding;
    return phpName;
}
function addPhpFile(xphpFileName, fileContent, config) {
    let realFileName = replaceXphpWithPhp(xphpFileName, config.xphpFileExtension.length, config.phpFileExtension);
    fs.writeFileSync(realFileName, fileContent);
}
module.exports = addPhpFile;