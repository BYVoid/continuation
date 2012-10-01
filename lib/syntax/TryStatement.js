var util = require('util');
var traverse = require('../traverse');
var BinaryExpression = require('./BinaryExpression');
var BlockStatement = require('./BlockStatement');
var CatchClause = require('./CatchClause');
var CallExpression = require('./CallExpression');
var ExpressionStatement = require('./ExpressionStatement');
var FunctionExpression = require('./FunctionExpression');
var Identifier = require('./Identifier');
var IfStatement = require('./IfStatement');
var ReturnStatement = require('./ReturnStatement');

var TryStatement = module.exports = function(block, handlers, finalizer) {
  this.type = 'TryStatement';
  this.block = block;
  this.handlers = handlers;
  this.finalizer = finalizer;
  if (!util.isArray(this.handlers)) {
    this.handlers = [this.handlers];
  }
  if (!this.finalizer) {
    this.finalizer = null;
  }
  this.async = false;
};

TryStatement.prototype.normalize = function (place) {
  this.block.normalize();
  for (var i = 0; i < this.handlers.length; i++) {
    this.handlers[i].normalize();
  }
  if (this.finalizer) {
    this.finalizer.normalize();
  }
  place.push(this);
};

TryStatement.prototype.transform = function (place) {
  var innerPlace = this.block.transform(place);
  
  //Not transform if not async calls inside
  if (!this.block.async) {
    place.push(this);
    return innerPlace;
  }

  var contIdentifier = new Identifier('cont');
  var errIdentifier = new Identifier('err');
  var breakCont = new ExpressionStatement(new CallExpression(contIdentifier, errIdentifier));
  
  //Make function for try block
  var tryFunction = new FunctionExpression(null, [contIdentifier], this.block);
  
  //Add try..catch block into every inner functions
  traverse(tryFunction, function (node) {
    if (node.type === 'FunctionExpression') {
      var innerTry = new TryStatement(node.body, new CatchClause(
        errIdentifier,
        null,
        new BlockStatement(breakCont)
      ));
      node.body = new BlockStatement(innerTry);
    }
    return node;
  });
  
  //Push explicit continuation statement
  innerPlace.push(new ExpressionStatement(new CallExpression(contIdentifier)));
  
  //Generate try handler
  //TODO multiple handlers
  var handler = this.handlers[0];
  var handlerWrap = new IfStatement(
    new BinaryExpression('!==', handler.param, new Identifier('undefined')),
    handler.body,
    null
  );
  var actualHandler = new FunctionExpression(
    null,
    [handler.param],
    new BlockStatement(handlerWrap)
  );
  var newPlace = actualHandler.body.body;
  if (this.finalizer !== null) {
    newPlace.push(this.finalizer);
  }
  
  var newStatement = new ExpressionStatement(new CallExpression(tryFunction, actualHandler));
  place.push(newStatement);
  return newPlace;
};
