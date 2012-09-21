var util = require('util');
var escodegen = require('escodegen');

var parser = require('./lib/parser');

exports.transform = function (code) {
  var ast = parser.parse(code);
  ast.normalize();
  //console.log(util.inspect(ast, false, null, true));
  ast.transform();
  return escodegen.generate(ast);
};
