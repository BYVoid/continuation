var assert = require('assert');
var BlockStatement = require('./BlockStatement');
var CallStatement = require('./CallStatement');
var Identifier = require('./Identifier');
var ReturnStatement = require('./ReturnStatement');
var IfStatement = require('./IfStatement');
var FunctionDeclaration = require('./FunctionDeclaration');
var FunctionExpression = require('./FunctionExpression');
var VariableDeclaration = require('./VariableDeclaration');
var helpers = require('../helpers');
var traverse = require('../traverse');

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
  
  //Move variable declarations outside
  var declarations = [];
  helpers.extractVariableDeclarations(this.body, declarations);
  declarations = helpers.reduceDeclarations(declarations);
  if (declarations.length > 0) {
    place.push(new VariableDeclaration(declarations, 'var'));
  }
  place.push(this);
};

WhileStatement.prototype.transform = function (place) {
  assert(this.body.type === 'BlockStatement');
  var blockPlace = this.body.transform();

  if (!this.body.async) {
    place.push(this);
    return place;
  }

  this.async = true;
  
  var loopFunctionName = helpers.getLoopFunctionName();
  var continuationName = loopFunctionName + '_' + helpers.continuationIdentifier;
  
  var nextStatement = new CallStatement(new Identifier(loopFunctionName), [new Identifier(continuationName)]);
  blockPlace.push(nextStatement);
  
  var continuationStatement = new CallStatement(new Identifier(continuationName), []);
  
  var body = new BlockStatement([new IfStatement(
    this.test,
    this.body,
    new BlockStatement([continuationStatement])
  )]);
  
  traverse(this.body, function (statement) {
    if (statement.type === 'BreakStatement') {
      statement = new ReturnStatement(continuationStatement.expression);
    } 
    return statement;
  });
  
  place.push(new FunctionDeclaration(
    new Identifier(loopFunctionName),
    [new Identifier(continuationName)],
    body
  ));
  
  var nextPlace = [];
  place.push(new CallStatement(
    new Identifier(loopFunctionName),
    [new FunctionExpression(null, [], new BlockStatement(nextPlace))]
  ));
  return nextPlace;
};
