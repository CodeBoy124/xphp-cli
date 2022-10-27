#! /usr/bin/env node
// imports
const search = require('./files/search');
const processXphpFile = require('./processFile/process');
const writePhpFile = require('./files/write');

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
    // detect all files with .xphp extension and translate them to php
    let xphpFiles = search(process.cwd());
    for (xphpFile of xphpFiles) {
        let translatedToRegularPhp = processXphpFile(xphpFile);
        writePhpFile(xphpFile, translatedToRegularPhp);
    }
} else if (arguments.length == 1 && arguments[0] == "version") {
    let configFile = require("../package.json");
    let version = configFile.version;
    console.log(`xphp-cli version ${version}`);
} else if (arguments.length == 1 && arguments[0] == "help") {
    console.log(`Welcome to the xphp cli.\nHere is a list of all supported commands and meanings:`);
    let dataToLog = {
        "xphp": "searches for xphp files in the current working directory and all it's subfolders",
        "xphp version": "Shows the current version of the xphp cli",
        "xphp help": "this"
    };
    for (let key in dataToLog) {
        let allKeys = Object.keys(dataToLog);
        let lengthOfKeys = allKeys.map(key => key.length);
        let longestKey = Math.max(...lengthOfKeys);
        let formattedKey = key + new Array(longestKey - key.length).fill(" ").join("");
        console.log(`${formattedKey}  |  ${dataToLog[key]}`);
    }
} else {
    console.log(`Did not find the command "xphp ${arguments.join(" ")}"\nIf you need help using this cli you can use the command "xphp help"`);
}