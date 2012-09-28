var util = require('util');
var escodegen = require('escodegen');

var parser = require('./lib/parser');
var helpers = require('./lib/helpers');

exports.transform = function (code) {
  helpers.reset();
  var ast = parser.parse(code);
  ast.normalize();
  //console.error(util.inspect(ast, false, null, true));
  ast.transform();
  return escodegen.generate(ast);
};
