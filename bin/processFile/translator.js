class Translation {
    constructor({ from, to = from, hasArguments = true, addOpenBracketAtEnd = true, addSemicolonAtEnd = false, useParenthesesForArguments = true }) {
        this.from = "@" + from;
        this.to = to;
        this.hasArguments = hasArguments;
        this.addOpenBracketAtEnd = addOpenBracketAtEnd;
        this.useParenthesesForArguments = useParenthesesForArguments;
        this.addSemicolonAtEnd = addSemicolonAtEnd;
    }
    run(args = "") {
        return `<?php ${this.to}${this.hasArguments ? (this.useParenthesesForArguments ? `(${args})` : ` ${args}`) : ''}${this.addOpenBracketAtEnd ? '{' : ''}${this.addSemicolonAtEnd ? ';' : ''} ?>`;
    }
}
module.exports = Translation;