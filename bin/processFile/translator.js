class Translation {
    constructor({ from, to = from, hasArguments = true, addOpenBracketAtEnd = true, addSemicolonAtEnd = false, useParenthesesForArguments = true, isInlinePhpTag = false }) {
        this.from = "@" + from;
        this.to = to;
        this.hasArguments = hasArguments;
        this.addOpenBracketAtEnd = addOpenBracketAtEnd;
        this.useParenthesesForArguments = useParenthesesForArguments;
        this.addSemicolonAtEnd = addSemicolonAtEnd;
        this.isInlinePhpTag = isInlinePhpTag;
    }
    run(args = "") {
        if (this.isInlinePhpTag) {
            return `<?= ${this.to}${this.hasArguments ? (this.useParenthesesForArguments ? `(${args})` : ` ${args}`) : ''}${this.addOpenBracketAtEnd ? '{' : ''}${this.addSemicolonAtEnd ? ';' : ''} ?>`;
        } else {
            return `<?php ${this.to}${this.hasArguments ? (this.useParenthesesForArguments ? `(${args})` : ` ${args}`) : ''}${this.addOpenBracketAtEnd ? '{' : ''}${this.addSemicolonAtEnd ? ';' : ''} ?>`;
        }
    }
}
module.exports = Translation;