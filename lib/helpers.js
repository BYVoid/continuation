var assert = require('assert');
var syntax = require('./syntax');
var traverse = require('./traverse');

exports.contName = 'cont';
exports.obtainName = 'obtain';
exports.parallelName = 'parallel';

exports.callbackName = '_$cont';
exports.loopPrefix = '_$loop_';
exports.errName = '_$err';
exports.errArray = '_$errors_';
exports.forInIter = '_$itmp';
exports.forInArray = '_$itmp_list';
exports.parallelCounter = '_$parallel_done_';
exports.paramPrefix = '_$param';

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
  innerFunc = new syntax.CallExpression(
    new syntax.MemberExpression(
      innerFunc,
      new syntax.Identifier('bind'),
      false
    ),
    [new syntax.ThisExpression()]
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

var parallelCount = 0;
exports.getParallelCountName = function () {
  var name = exports.parallelCounter + parallelCount;
  parallelCount ++;
  return name;
};

var errArrayCount = 0;
exports.getErrorArrayName = function () {
  var name = exports.errArray + errArrayCount;
  errArrayCount ++;
  return name;
};

var paramCount = 0;
exports.getParameterName = function () {
  var name = exports.paramPrefix + paramCount;
  paramCount ++;
  return name;
};

exports.reset = function () {
  loopCount = 0;
  parallelCount = 0;
  errArrayCount = 0;
  paramCount = 0;
};
