/**
 * @fileoverview Rule to enforce the number of spaces after function keyword
 * @author Ian Sibner
 * Implementation taken from Nick Fisher's default rule 'space-after-keywords'
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

    // unless the first option is `'never'`, then a space is required
    var requiresSpace = context.options[0] !== 'never';

    /**
     * Check if the separation of two adjacent tokens meets the spacing rules, and report a problem if not.
     *
     * @param {ASTNode} node  The node to which the potential problem belongs.
     * @param {Token} left    The first token.
     * @param {Token} right   The second token
     * @returns {void}
     */
    function checkTokens (node, left, right) {
        var hasSpace = left.range[1] < right.range[0];
        var value = left.value;

        if (hasSpace !== requiresSpace) {
            context.report(node, 'Keyword \'{{value}}\' must {{not}} be followed by whitespace.', {
                value: value,
                not: requiresSpace ? '' : 'not '
            });
        }
    }

    /**
     * Check if the given node (`if`, `for`, `while`, etc), has the correct spacing after it.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     */
    function check (node) {
        var tokens = context.getFirstTokens(node, 2);
        checkTokens(node, tokens[0], tokens[1]);
    }

    return {
        'FunctionExpression': check
    };
};
