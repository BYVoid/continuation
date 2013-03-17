var util = require('util');

var TryStatement = module.exports = function (block, handlers, finalizer, loc, range) {
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
  this.loc = loc;
  this.range = range;
};

TryStatement.prototype.transform = function (place) {
  var traverse = require('../traverse');
  var helpers = require('../helpers');
  var BinaryExpression = require('./BinaryExpression');
  var BlockStatement = require('./BlockStatement');
  var CatchClause = require('./CatchClause');
  var CallExpression = require('./CallExpression');
  var ExpressionStatement = require('./ExpressionStatement');
  var FunctionExpression = require('./FunctionExpression');
  var Identifier = require('./Identifier');
  var IfStatement = require('./IfStatement');
  var ReturnStatement = require('./ReturnStatement');

  var innerPlace = this.block.transform();
  var blockAsync = (innerPlace != this.block.body);
  //TODO multiple handlers (but multiple handles seems not supported by V8)
  var handler = this.handlers[0];
  var handlerAsync = false;
  if (handler) {
    var handlerPlace = handler.transform();
    handlerAsync = (handlerPlace != handler.body.body);
  }
  //Not transform if not async calls inside
  if (!(blockAsync || handlerAsync)) {
    place.push(this);
    return place;
  }
  var callbackId = new Identifier(helpers.callbackName);
  var errId = new Identifier(helpers.errName);
  var callbackStmt = new ExpressionStatement(new CallExpression(callbackId));
  var breakCont = new ExpressionStatement(new CallExpression(callbackId, errId));
  if (blockAsync) {
    //Push explicit continuation statement
    innerPlace.push(callbackStmt);
    //Make function for try block
    var tryFunction = new FunctionExpression(null, [callbackId], this.block);
    //Add try..catch block into every inner functions
    traverse(tryFunction, {currentScope: true}, function (node) {
      if (node.type === 'FunctionExpression' && node.isContinuation) {
        var innerTry = new TryStatement(node.body, new CatchClause(
          errId,
          null,
          new BlockStatement(breakCont)
        ));
        node.body = new BlockStatement(innerTry);
      }
      return node;
    });
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
    var tryCatch = new ExpressionStatement(
      new CallExpression(tryFunction, handlerFunction)
    );
  } else {
    var tryCatch = this;
  }
  if (handler) {
    if (handlerAsync) {
      //If there's async call in catch clause, do CPS transformation on catch function
      var continuationFunction = new FunctionExpression(null, [], new BlockStatement());
      var catchFunction = new FunctionExpression(
        null,
        [callbackId],
        new BlockStatement(tryCatch)
      );
      var tryCatchContinuation = new ExpressionStatement(new CallExpression(
        catchFunction,
        [continuationFunction]
      ));
      place.push(tryCatchContinuation);
      handlerPlace.push(callbackStmt);
      if (blockAsync) {
        //Set continuation for non-exception condition
        judgeIfException.alternate = callbackStmt;
      } else {
        //Terminate execution after async call
        handler.body.body.push(new ReturnStatement());
        //Add continuation call for non-exception condition
        catchFunction.body.body.push(callbackStmt);
      }
      var continuationPlace = continuationFunction.body.body;
    } else {
      //Or else directly add catch function
      place.push(tryCatch);
      var continuationPlace = handlerFunction.body.body;
    }
  }
  //If finally clause found, push it into continuation place
  if (this.finalizer !== null) {
    for (var i = 0; i < this.finalizer.body.length; i++) {
      continuationPlace.push(this.finalizer.body[i]);
    }
  }
  return continuationPlace;
};
