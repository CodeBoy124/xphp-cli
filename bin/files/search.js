// imports
const fs = require('fs');
const path = require('path');

// file functions
function isXphpFile(fileName, xphpFileExtension) {
    return fileName.endsWith(xphpFileExtension);
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
function searchFolder(currentFolder, xphpFileEnding) {
    let fileList = [];
    let filesAndDirectoriesInFolder = getFolderContent(currentFolder);
    for (let fileOrDirectory of filesAndDirectoriesInFolder) {
        if (isDir(path.join(currentFolder, fileOrDirectory))) {
            // run function again in folder
            fileList = [
                ...fileList,
                ...searchFolder(path.join(currentFolder, fileOrDirectory))
            ];
        } else if (isXphpFile(fileOrDirectory, xphpFileEnding)) {
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