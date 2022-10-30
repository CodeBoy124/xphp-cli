const fs = require('fs');
const path = require('path');

function isExists(path) {
    return fs.existsSync(path);
};

async function writeFile(filePath, data) {
    try {
        const dirname = path.dirname(filePath);
        const exist = isExists(dirname);
        console.log(`${dirname}: ${exist}`);
        if (!exist) {
            fs.mkdirSync(dirname, { recursive: true });
        }

        fs.writeFileSync(filePath, data);
    } catch (err) {
        throw new Error(err);
    }
}

function replaceXphpWithPhp(xphpFileName, sliceAmount, phpFileEnding) {
    let nameWithoutXphp = xphpFileName.slice(0, -sliceAmount);
    let phpName = nameWithoutXphp + phpFileEnding;
    return phpName;
}
async function addPhpFile(xphpFileName, fileContent, config, outputFolder) {
    let realFileName = replaceXphpWithPhp(path.join(outputFolder, xphpFileName), config.xphpFileExtension.length, config.phpFileExtension);
    await writeFile(realFileName, fileContent);
}
module.exports = addPhpFile;