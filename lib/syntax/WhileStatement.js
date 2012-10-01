var assert = require('assert');
var helpers = require('../helpers');
var traverse = require('../traverse');
var BlockStatement = require('./BlockStatement');
var CallExpression = require('./CallExpression');
var ExpressionStatement = require('./ExpressionStatement');
var Identifier = require('./Identifier');
var ReturnStatement = require('./ReturnStatement');
var IfStatement = require('./IfStatement');
var FunctionDeclaration = require('./FunctionDeclaration');
var FunctionExpression = require('./FunctionExpression');
var VariableDeclaration = require('./VariableDeclaration');
var SequenceExpression = require('./SequenceExpression');

var WhileStatement = module.exports = function(test, body) {
  this.type = 'WhileStatement';
  this.test = test;
  this.body = body;
  this.async = false;
};

WhileStatement.prototype.normalize = function (place) {
  if (this.body === null) {
    this.body = new BlockStatement([]);
  } else if (this.body.type !== 'BlockStatement') {
    this.body = new BlockStatement([this.body]);
  }
  
  this.body.normalize();
  place.push(this);
};

WhileStatement.prototype.transform = function (place) {
  assert(this.body.type === 'BlockStatement');
  var blockPlace = this.body.transform();

  if (!this.body.async) {
    place.push(this);
    return place;
  }

  //At least one statement within body transformed
  this.async = true;
  
  var loopFunctionName = helpers.getLoopFunctionName();
  var continuationName = loopFunctionName + '_' + helpers.continuationIdentifier;
  
  //nextStatement is equivalant to continue statement, i.e. loop_0(loop_0_cont)
  var nextStatement = new ExpressionStatement(new CallExpression(new Identifier(loopFunctionName), [new Identifier(continuationName)]));
  //Add explicit continuation statement on the back of inner block
  blockPlace.push(nextStatement);
  
  //continuationStatement is like break statement, i.e. loop_0_cont()
  var continuationStatement = new ExpressionStatement(new CallExpression(new Identifier(continuationName), []));
  
  var body = new BlockStatement([new IfStatement(
    this.test,
    this.body,
    new BlockStatement([continuationStatement])
  )]);
  
  var updateExpression = this.update;
  
  //Transform break and continue statements
  traverse(this.body, function (statement) {
    if (statement.type === 'BreakStatement') {
      statement = new ReturnStatement(continuationStatement.expression);
    } else if (statement.type === 'ContinueStatement') {
      if (updateExpression) {
        var seqExpression = new SequenceExpression([updateExpression, nextStatement.expression]);
        statement = new ReturnStatement(seqExpression);
      } else {
        statement = new ReturnStatement(nextStatement.expression);
      }
    }
    return statement;
  });
  
  //Generate loop function
  place.push(new FunctionDeclaration(
    new Identifier(loopFunctionName),
    [new Identifier(continuationName)],
    body
  ));
  
  //Generate loop function invocation statement and continuation part
  var nextPlace = [];
  place.push(new ExpressionStatement(new CallExpression(
    new Identifier(loopFunctionName),
    [new FunctionExpression(null, [], new BlockStatement(nextPlace))]
  )));
  return nextPlace;
};
