#! /usr/bin/env node
// imports
const path = require('path');

const search = require('./files/search');
const processXphpFile = require('./processFile/process');
const writePhpFile = require('./files/write');
const writeBasicXphpConfigFile = require('./config/write');
const readConfigFile = require('./config/read');

// get all arguments passed to cli
function allToLowerCase(strArray) {
    let out = [];
    for (let str of strArray) {
        out.push(str.toLowerCase());
    }
    return out;
}
const arguments = allToLowerCase(process.argv.slice(2));

if (arguments.length == 0) {
    // load config file if there is any
    let config = readConfigFile(process.cwd());

    // detect all files with .xphp extension and translate them to php
    let xphpFiles = search(process.cwd(), config.xphpFileExtension);
    let amountOfFilesReady = 0;
    for (xphpFile of xphpFiles) {
        console.log(`Processing file ${path.relative(process.cwd(), xphpFile)}`);
        let translatedToRegularPhp = processXphpFile(xphpFile, config);
        writePhpFile(xphpFile, translatedToRegularPhp, config);
        amountOfFilesReady++;
        console.log(`Ready. ${amountOfFilesReady}/${xphpFiles.length} done.`);
    }
} else if (arguments.length == 1 && arguments[0] == "init") {
    writeBasicXphpConfigFile(process.cwd());
} else if (arguments.length == 1 && arguments[0] == "version") {
    // log the current xphp-cli version
    let configFile = require("../package.json");
    let version = configFile.version;
    console.log(`xphp-cli version ${version}`);
} else if (arguments.length == 1 && arguments[0] == "help") {
    // log all the supported commands
    console.log(`Welcome to the xphp cli.\nHere is a list of all supported commands and meanings:`);
    let dataToLog = {
        "xphp": "Searches for xphp files in the current working directory and all it's subfolders and converts them to php",
        "xphp version": "Shows the current version of the xphp cli",
        "xphp init": "Creates a basic xphpconfig.json file. This is optional, but if you want to customize the behaviour you can use that file",
        "xphp help": "This"
    };
    for (let key in dataToLog) {
        let allKeys = Object.keys(dataToLog);
        let lengthOfKeys = allKeys.map(key => key.length);
        let longestKey = Math.max(...lengthOfKeys);
        let formattedKey = key + new Array(longestKey - key.length).fill(" ").join("");
        console.log(`${formattedKey}  |  ${dataToLog[key]}`);
    }
} else {
    // no command found, so a message is shown
    console.log(`Did not find the command "xphp ${arguments.join(" ")}"\nIf you need help using this cli you can use the command "xphp help"`);
}