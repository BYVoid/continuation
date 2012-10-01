var assert = require('assert');
var syntax = require('./syntax');
var traverse = require('./traverse');

var CallStatement = require('./syntax/CallStatement');
var Identifier = require('./syntax/Identifier');

var continuationIdentifier = exports.continuationIdentifier = 'cont';
var continuationStatement = exports.continuationStatement = new CallStatement(new Identifier(continuationIdentifier), []);

exports.extractVariableDeclarations = function (block) {
  var decMap = {};
  
  traverse(block, {currentScope: true}, function (node) {
    if (node.type === 'VariableDeclaration') {
      if (block.body.indexOf(node) === -1) {
      
        var assignments = [];
        node.declarations.forEach(function (dec) {
          decMap[dec.id.name] = dec;
          if (dec.init !== null) {
            //Replace variable declaration with assignment
            assignments.push(new syntax.AssignmentExpression('=', dec.id, dec.init));
            dec.init = null;
          }
        });
      
        if (assignments.length === 0) {
          node = new syntax.EmptyStatement();
        } else if (assignments.length === 1) {
          node = new syntax.ExpressionStatement(assignments[0]);
        } else {
          node = new syntax.ExpressionStatement(new syntax.SequenceExpression(assignments));
        }
      }
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

exports.continuationToCallback = function (args) {
  var contPos = findContinuation(args);
  if (contPos !== -1) {
    //Function call with continuation
    var contExpr = args[contPos];
    var callbackBlock = [];
    contExpr.arguments.forEach(function (argName, index) {
      callbackBlock.push(new syntax.VariableDeclaration(
        [new syntax.VariableDeclarator(
          argName,
          new syntax.MemberExpression(new Identifier('arguments'), new syntax.Literal(index))
        )],
        'var'
      ));
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

exports.reset = function () {
  loopCount = 0;
};

exports.isContinuationStatement = function (statement) {
  return statement.type === 'ExpressionStatement' &&
    statement.expression.type === 'CallExpression' &&
    statement.expression.callee.name === continuationIdentifier;
};

Array.prototype.pushFront = function (elem) {
  this.reverse();
  this.push(elem);
  this.reverse();
};
