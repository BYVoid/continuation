var assert = require('assert');
var syntax = require('./syntax');

var CallStatement = require('./syntax/CallStatement');
var Identifier = require('./syntax/Identifier');

var continuationIdentifier = exports.continuationIdentifier = 'cont';
var continuationStatement = exports.continuationStatement = new CallStatement(new Identifier(continuationIdentifier), []);

var reduceDeclarations = exports.reduceDeclarations = function (declarations) {
  var decMap = {};
  declarations.forEach(function (dec) {
    decMap[dec.id.name] = dec;
  });
  declarations = [];
  Object.keys(decMap).forEach(function (name) {
    var dec = decMap[name];
    dec.init = null;
    declarations.push(dec);
  });
  return declarations;
}

exports.extractVariableDeclarations = function (block, declarations) {
  var normalStatements = [];
  block.body.forEach(function (statement) {
    if (statement.type === 'VariableDeclaration') {
      statement.declarations.forEach(function (dec) {
        declarations.push(dec);
        if (dec.init !== null) {
          normalStatements.push(new syntax.ExpressionStatement(new syntax.AssignmentExpression('=', dec.id, dec.init)));
        }
      });
    } else {
      normalStatements.push(statement);
    }
  });
  block.body = normalStatements;
}

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

exports.continuationToCallback = function (args) {
  var contPos = findContinuation(args);
  if (contPos !== -1) {
    //Function call with continuation
    var contExpr = args[contPos];
    var callbackBlock = [];
    contExpr.arguments.forEach(function (arg, index) {
      callbackBlock.push(new syntax.AssignmentStatement(arg, new syntax.MemberExpression(new Identifier('arguments'), new syntax.Literal(index))));
    });
    
    //Replace continuation with a callback function
    args[contPos] = new syntax.FunctionExpression(
      null,
      [],
      new syntax.BlockStatement(callbackBlock)
    );
    return callbackBlock;
  }
};

exports.makeCPS = function (innerPlace, nextPlace) {
  return new syntax.CallStatement(
    new syntax.FunctionExpression(
      null,
      [new Identifier(continuationIdentifier)],
      new syntax.BlockStatement(innerPlace)
    ),
    [new syntax.FunctionExpression(
      null,
      [],
      new syntax.BlockStatement(nextPlace)
    )]
  );
};

var loopCount = 0;
exports.getLoopFunctionName = function () {
  var name = 'loop_' + loopCount;
  loopCount ++;
  return name;
};

exports.isContinuationStatement = function (statement) {
  return statement.type === 'ExpressionStatement' &&
    statement.expression.type === 'CallExpression' &&
    statement.expression.callee.name === continuationIdentifier;
};
