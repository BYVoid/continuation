var BinaryExpression = require('./BinaryExpression');
var BlockStatement = require('./BlockStatement');
var CallExpression = require('./CallExpression');
var ExpressionStatement = require('./ExpressionStatement');
var FunctionExpression = require('./FunctionExpression');
var Identifier = require('./Identifier');
var IfStatement = require('./IfStatement');
var ReturnStatement = require('./ReturnStatement');
var traverse = require('../traverse');

var TryStatement = module.exports = function(block, handlers, finalizer) {
  this.type = 'TryStatement';
  this.block = block;
  this.handlers = handlers;
  this.finalizer = finalizer;
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
  innerPlace = this.block.transform(place);
  
  //Not transform if not async calls inside
  if (!this.block.async) {
    place.push(this);
    return innerPlace;
  }

  var contIdentifier = new Identifier('cont');
  
  //Transform throw statement into continuation break
  traverse(this.block, function (node) {
    if (node.type === 'ThrowStatement') {
      node = new ReturnStatement(new CallExpression(
        contIdentifier,
        [node.argument]
      ));
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
  
  var newStatement = new ExpressionStatement(new CallExpression(
    new FunctionExpression(null, [contIdentifier], this.block),
    [actualHandler]
  ));
  
  place.push(newStatement);
  return handler.body;
};
