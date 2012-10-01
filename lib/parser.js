var util = require('util');
var esprima = require('esprima');
var syntax = require('./syntax');
var traverse = require('./traverse');

exports.parse = function parse(code) {
  var options = {
    //loc: true,
    range: true,
    token: true,
    comment: true,
  };
  var ast = esprima.parse(code, options);
  //console.log(util.inspect(ast, false, null, true));
  ast = new syntax.Program(ast.body, ast.comments);
  
  traverse(ast, syntax.factory);
  //console.log(util.inspect(ast, false, null, true));
  return ast;
}

