// imports
const search = require('./files/search');
const processXphpFile = require('./processFile/process');
const writePhpFile = require('./files/write');

// detect all files with .xphp extension and translate them to php
let xphpFiles = search(process.cwd());
for (xphpFile of xphpFiles) {
    let translatedToRegularPhp = processXphpFile(xphpFile);
    writePhpFile(xphpFile, translatedToRegularPhp);
}