var assert = require('assert');
var syntax = require('./syntax');
var traverse = require('./traverse');

exports.contName = 'cont';
exports.obtainName = 'obtain';
exports.parallelName = 'parallel';

exports.callbackName = '_$cont';
exports.loopPrefix = '_$loop_';
exports.errName = '_$err';
exports.errArray = '_$errors';
exports.forInIter = '_$itmp';
exports.forInArray = '_$itmp_list';
exports.parallelCounter = '_$parallel_done';

exports.extractVariableDeclarations = function (block) {
  var decMap = {};
  traverse(block, {currentScope: true}, function (node) {
    if (node.type === 'VariableDeclaration') {
      var assignments = [];
      node.declarations.forEach(function (dec) {
        decMap[dec.id.name] = dec;
        if (dec.init !== null) {
          //Replace variable declaration with assignment
          assignments.push(new syntax.ExpressionStatement(new syntax.AssignmentExpression('=', dec.id, dec.init)));
          dec.init = null;
        }
      });
      node = assignments;
    } else if (node.needDeclaration) {
      decMap[node.name] = new syntax.VariableDeclarator(node);
    }
    return node;
  });
  
  var declarations = [];
  Object.keys(decMap).forEach(function (name) {
    var dec = decMap[name];
    dec.init = null;
    declarations.push(dec);
  });
  
  return new syntax.VariableDeclaration(declarations, 'var');
};

exports.makeCPS = function (innerPlace, nextPlace) {
  var innerFunc = new syntax.FunctionExpression(
    null,
    [new syntax.Identifier(exports.callbackName)],
    new syntax.BlockStatement(innerPlace)
  );
  var continuationFunc = new syntax.FunctionExpression(
    null,
    [],
    new syntax.BlockStatement(nextPlace)
  );
  return new syntax.ExpressionStatement(new syntax.CallExpression(
    innerFunc,
    [continuationFunc]
  ));
};

var loopCount = 0;
exports.getLoopFunctionName = function () {
  var name = exports.loopPrefix + loopCount;
  loopCount ++;
  return name;
};

exports.reset = function () {
  loopCount = 0;
};
