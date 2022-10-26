class Translation {
    constructor({ from, to = from, hasArguments = true, addOpenBracketAtEnd = true }) {
        this.from = "@" + from;
        this.to = to;
        this.hasArguments = hasArguments;
        this.addOpenBracketAtEnd = addOpenBracketAtEnd;
    }
    run(args = "") {
        return `<?php ${this.to}${this.hasArguments ? `(${args})` : ''}${this.addOpenBracketAtEnd ? '{' : ''} ?>`;
    }
}
module.exports = Translation;