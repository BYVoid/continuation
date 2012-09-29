var util = require('util');
var esprima = require('esprima');
var syntax = require('./syntax');
var traverse = require('./traverse');

exports.parse = function parse(code) {
  var options = {
    //loc: true,
    comment: true,
  };
  var ast = esprima.parse(code, options);
  ast = new syntax.Program(ast.body, ast.comments);
  
  traverse(ast, syntax.factory);
  //console.log(util.inspect(ast, false, null, true));
  return ast;
}

