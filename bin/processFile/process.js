// imports
const fs = require('fs');
const path = require('path');

const readJsonFile = require('../files/readJson');

// functions for {{ ... }} syntax
function processInlinePhp(input) {
    let output = "";

    let inString = false;
    let stringType = "";

    let inInlinePhp = false;

    for (let charIndex = 0; charIndex < input.length; charIndex++) {
        let currentChar = input[charIndex];
        if (charIndex + 1 >= input.length) {
            output += currentChar;
            continue;
        };
        let nextChar = input[charIndex + 1];
        if (!inString && currentChar + nextChar == "{{") { // handle {{...}}
            charIndex += 1;
            output += "<?=";
            inInlinePhp = true;
        } else if (!inString && currentChar + nextChar == "}}") {
            charIndex += 1;
            output += "?>";
            inInlinePhp = false;
        } else if (inInlinePhp && !inString && currentChar == "\"") { // handle "..." strings
            inString = true;
            stringType = "\"";
            output += currentChar;
        } else if (inInlinePhp && inString && currentChar == "\"" && stringType != "'") {
            inString = false;
            stringType = "";
            output += currentChar;
        } else if (inInlinePhp && !inString && currentChar == "'") { // handle '...' strings
            inString = true;
            stringType = "'";
            output += currentChar;
        } else if (inInlinePhp && inString && currentChar == "'" && stringType != "\"") {
            inString = false;
            stringType = "";
            output += currentChar;
        } else { // add regular character if nothing else matches
            output += currentChar;
        }
    }
    return output;
}

// functions for processing xphp tags
function isInlinePhpOpening(charIndex, input) {
    if (charIndex + 2 >= input.length) return false;
    if (input[charIndex] + input[charIndex + 1] + input[charIndex + 2] == "<?=") {
        return true;
    }
    return false;
}
function isInlinePhpClosing(charIndex, input) {
    if (charIndex + 1 >= input.length) return false;
    if (input[charIndex] + input[charIndex + 1] == "?>") {
        return true;
    }
    return false;
}

// process xphp tags
function processXphpTags(input) {
    let output = "";

    let inInlinePhp = false;

    for (let charIndex = 0; charIndex < input.length; charIndex++) {
        // detect if the current tag/character is inside of inline xphp
        if (isInlinePhpOpening(charIndex, input)) {
            inInlinePhp = true;
            charIndex += 2;
            output += "<?=";
            continue;
        } else if (isInlinePhpClosing(charIndex, input)) {
            inInlinePhp = false;
            charIndex += 1;
            output += "?>";
            continue;
        }

        if (inInlinePhp) { // if the tag is inside some inline xphp then it will not convert the tag, but keep it as is
            output += input[charIndex];
            continue;
        }

        // check if any tag matches with the current (+upcomming) characters
        let matchedTag = null;
        for (let tag of translations) {
            if (charIndex + ("@" + tag.from).length > input.length) continue;
            if (input.slice(charIndex, charIndex + ("@" + tag.from).length) != ("@" + tag.from)) continue;
            matchedTag = tag;
            charIndex += ("@" + tag.from).length - 1;
            break;
        }

        // there is no tag that matched with the current index, so the character can be added to the output
        if (matchedTag === null) {
            let currentChar = input[charIndex];
            output += currentChar;
            continue;
        }

        // parse the arguments of the tag
        let arguments = "";
        if (charIndex + 1 < input.length && input[charIndex + 1] == "(") {
            let parenthesisCount = 1;
            charIndex += 2;

            let inString = false;
            let stringType = "";

            while (charIndex < input.length && parenthesisCount > 0) {
                let currentChar = input[charIndex];
                if (!inString && currentChar == "(") { // handle new (...) groups made within the arguments
                    parenthesisCount++;
                } else if (!inString && currentChar == ")") {
                    parenthesisCount--;
                } else if (!inString && currentChar == "\"") { // handle "..." strings
                    inString = true;
                    stringType = "\"";
                } else if (inString && currentChar == "\"" && stringType != "'") {
                    inString = false;
                    stringType = "";
                } else if (!inString && currentChar == "'") { // handle '...' strings
                    inString = true;
                    stringType = "'";
                } else if (inString && currentChar == "'" && stringType != "\"") {
                    inString = false;
                    stringType = "";
                }

                if (parenthesisCount > 0) { // exit loop if the arguments are closed
                    arguments += currentChar;
                    charIndex++;
                }
            }
        }
        // actually translate xphp tag to php tag
        output += matchedTag.to(arguments);
    }
    return output;
}

// xphp tag translations to regular php
let translations = []
function getDefaultTranslations() {
    return [
        {
            from: "end",
            to() {
                return `<?php } ?>`;
            }
        },
        {
            from: "foreach",
            to(args) {
                return `<?php foreach(${args}){ ?>`;
            }
        },
        {
            from: "if",
            to(args) {
                return `<?php if(${args}){ ?>`;
            }
        },
        {
            from: "elif",
            to(args) {
                return `<?php }elseif(${args}){ ?>`;
            }
        },
        {
            from: "elseif",
            to(args) {
                return `<?php }elseif(${args}){ ?>`;
            }
        },
        {
            from: "else",
            to() {
                return `<?php }else{ ?>`;
            }
        },
        {
            from: "for",
            to(args) {
                return `<?php for(${args}){ ?>`;
            }
        },
        {
            from: "while",
            to(args) {
                return `<?php while(${args}){ ?>`;
            }
        },
        {
            from: "include",
            to(args) {
                return `<?php include ${args}; ?>`;
            }
        },
        {
            from: "require",
            to(args) {
                return `<?php require ${args}; ?>`;
            }
        },
        {
            from: "namespace",
            to(args) {
                return `<?php namespace ${args}; ?>`;
            }
        }
    ];
}
function getTranslations(configuredTags) {
    let output = [];
    for (let tagGroup of configuredTags) {
        if (tagGroup == "default") {
            output = [...output, ...getDefaultTranslations()];
        } else {
            let fullTagGroupPath = path.join(process.cwd(), tagGroup);
            let tagGroupImport = require(fullTagGroupPath);
            output = [...output, ...tagGroupImport];
        }
    }
    translations = output;
}

// main function
function Process(fileName, config) {
    let output = fs.readFileSync(fileName, 'utf8');
    if (config.useInlineXphp) {
        output = processInlinePhp(output);
    }
    getTranslations(config.tags);
    output = processXphpTags(output);
    return output;
}
module.exports = Process;