
var path = require('path')

module.exports = {
  parser: "babel-eslint",

  extends: "default",
  
  rules: {
    semi: [2, "never"],
    "space-before-function-paren": [2, "always"],
    "no-throw-literal": 0,
    "max-len": [1, 120, 2, {ignoreComments: true}],
    "space-infix-ops": 0,
    "no-else-return": 0,
    "no-param-reassign": 0,
    "no-mixed-operators": 0,
    "arrow-parens": [2, "always"],
    "comma-dangle": [2, "only-multiline"],
  },

  env: {
    browser: true,
    node: true,
    mocha: true
  }
}
