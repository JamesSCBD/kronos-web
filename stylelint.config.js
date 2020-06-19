module.exports = {
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'block-no-empty'           : true,
    'color-no-invalid-hex'     : true,
    'comment-empty-line-before': [ 'always', {
      ignore: [ 'stylelint-commands', 'after-comment' ],
    }],
    'declaration-colon-space-after': 'always',
    indentation                    : [ 2, { baseIndentLevel: 0 }],
    'max-empty-lines'              : 2,
    'unit-whitelist'               : [ 'px', 'em', 'rem', '%', 's', 'vh', 'vw', 'deg' ],
  },
};
