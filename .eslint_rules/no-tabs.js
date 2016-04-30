/**
 * @fileoverview Disallow any tabs. Period.
 * @author Ian Sibner
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {
  // public
  return {
    Program: function (node) {
      var lines = context.getSourceLines();
      lines.forEach(function (line, i) {
        var index = line.indexOf('\t');
        if (index > -1) {
          context.report(node, { line: i + 1, column: index + 1 }, 'Tab character.');
        }
      });
    }
  };
};
