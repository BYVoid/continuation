var assert = require('assert');
var syntax = require('./syntax');
var traverse = require('./traverse');

var continuationIdentifier = exports.continuationIdentifier = 'cont';
exports.errName = 'err';

exports.__defineGetter__('continuationStatement', function () {
  return new syntax.ExpressionStatement(new syntax.CallExpression(new syntax.Identifier(continuationIdentifier)));
});

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
        } else if (node.forIn) {
          assignments = dec.id;
        }
      });
      node = assignments;
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

function findContinuation(args) {
  //Todo check multiple continuations && defer
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg.type === 'CallExpression' && arg.callee.name === 'continuation') {
      return i;
    }
  }
  return -1;
}

exports.makeCPS = function (innerPlace, nextPlace) {
  return new syntax.ExpressionStatement(new syntax.CallExpression(
    new syntax.FunctionExpression(
      null,
      [new syntax.Identifier(continuationIdentifier)],
      new syntax.BlockStatement(innerPlace)
    ),
    [new syntax.FunctionExpression(
      null,
      [],
      new syntax.BlockStatement(nextPlace)
    )]
  ));
};

var loopCount = 0;
exports.getLoopFunctionName = function () {
  var name = 'loop_' + loopCount;
  loopCount ++;
  return name;
};

exports.reset = function () {
  loopCount = 0;
};

exports.isContinuationStatement = function (statement) {
  return statement.type === 'ExpressionStatement' &&
    statement.expression.type === 'CallExpression' &&
    statement.expression.callee.name === continuationIdentifier;
};
