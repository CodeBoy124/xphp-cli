// imports
const fs = require('fs');
const path = require('path');

// file functions
function getExtension(fileName) {
    let fileParts = fileName.split(".");
    if (fileParts.length == 1) return "";
    let rawFileExtension = fileParts[fileParts.length - 1];
    let formatedExtension = rawFileExtension.toLowerCase();
    return formatedExtension;
}
function isXphpFile(fileName) {
    return getExtension(fileName) == "xphp";
}

// directory function
function getFolderContent(pathToFolder) {
    return fs.readdirSync(pathToFolder);
}
function isDir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

// main function
function searchFolder(currentFolder) {
    let fileList = [];
    let filesAndDirectoriesInFolder = getFolderContent(currentFolder);
    for (let fileOrDirectory of filesAndDirectoriesInFolder) {
        if (isDir(path.join(currentFolder, fileOrDirectory))) {
            // run function again in folder
            fileList = [
                ...fileList,
                ...searchFolder(path.join(currentFolder, fileOrDirectory))
            ];
        } else if (isXphpFile(fileOrDirectory)) {
            let fullPath = path.join(currentFolder, fileOrDirectory);
            console.log(`found ${path.relative(process.cwd(), fullPath)}`);
            fileList = [
                ...fileList,
                fullPath
            ];
        }
    }
    return fileList;
}

module.exports = searchFolder;