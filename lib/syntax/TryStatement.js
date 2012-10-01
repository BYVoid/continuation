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

  //TODO multiple handlers
  var handler = this.handlers[0];
  var handlerPlace = handler.transform(place);
  
  //Not transform if not async calls inside
  if (!this.block.async && !handler.async) {
    place.push(this);
    return innerPlace;
  }

  var contIdentifier = new Identifier('cont');
  var errIdentifier = new Identifier('err');
  var cont = new ExpressionStatement(new CallExpression(contIdentifier));
  var breakCont = new ExpressionStatement(new CallExpression(contIdentifier, errIdentifier));
  
  if (this.block.async) {
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
    innerPlace.push(cont);
  
    //Generate try handler function
    var judgeIfException = new IfStatement(
      new BinaryExpression('!==', handler.param, new Identifier('undefined')),
      handler.body,
      null
    );
    var handlerFunction = new FunctionExpression(
      null,
      [handler.param],
      new BlockStatement(judgeIfException)
    );
    var tryCatch = new ExpressionStatement(new CallExpression(tryFunction, handlerFunction));
  } else {
    var tryCatch = this;
  }
  
  if (handler.async) {
    //If there's async call in catch clause, do CPS transformation on catch function
    var continuationFunction = new FunctionExpression(null, [], new BlockStatement());
    var catchFunction = new FunctionExpression(
      null,
      [contIdentifier],
      new BlockStatement(tryCatch)
    );
    
    var tryCatchContinuation = new ExpressionStatement(new CallExpression(
      catchFunction,
      [continuationFunction]
    ));
    place.push(tryCatchContinuation);
    
    handlerPlace.push(cont);
    if (this.block.async) {
      //Set continuation for non-exception condition
      judgeIfException.alternate = cont;
    } else {
      //Terminate execution after async call
      handler.body.body.push(new ReturnStatement());
      //Add continuation call for non-exception condition
      catchFunction.body.body.push(cont);
    }
    var continuationPlace = continuationFunction.body.body;
  } else {
    //Or else directly add catch function
    place.push(tryCatch);
    var continuationPlace = handlerFunction.body.body;
  }
  
  //If finally clause found, push it into continuation place
  if (this.finalizer !== null) {
    for (var i = 0; i < this.finalizer.body.length; i++) {
      continuationPlace.push(this.finalizer.body[i]);
    }
  }
  
  return continuationPlace;
};
