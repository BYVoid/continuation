var util = require('util');
var helpers = require('../helpers');
var AssignmentExpression = require('./AssignmentExpression');
var BlockStatement = require('./BlockStatement');
var ExpressionStatement = require('./ExpressionStatement');
var FunctionExpression = require('./FunctionExpression');
var Identifier = require('./Identifier');
var IfStatement = require('./IfStatement');
var Literal = require('./Literal');
var MemberExpression = require('./MemberExpression');
var ThrowStatement = require('./ThrowStatement');
var VariableDeclaration = require('./VariableDeclaration');
var VariableDeclarator = require('./VariableDeclarator');

var CallExpression = module.exports = function (callee, args, loc, range) {
  this.type = 'CallExpression';
  this.callee = callee;
  this.arguments = args;
  if (!this.arguments) {
    this.arguments = [];
  }
  if (!util.isArray(this.arguments)) {
    this.arguments = [this.arguments];
  }
  this.loc = loc;
  this.range = range;
};

CallExpression.prototype.normalize = function () {
  var self = this;
  
  findContinuation(this.arguments, function (contExpr, contPos, options) {
    if (options.obtain) {
      //Support obtain statement
      contExpr.arguments.unshift(new Identifier(helpers.errName));
    }
    
    contExpr.arguments.forEach(function (argument, index) {
      //Declare argument variable if not defined
      if (argument.type === 'Identifier') {
        argument.needDeclaration = true;
      }
    });
  });

  return this;
};

CallExpression.prototype.transform = function (place) {
  var self = this;
  
  place = this.callee.transform(place);
  
  if (this.callee.type === 'Identifier' && this.callee.name === helpers.parallelName) {
    return this.transformParallel(place);
  }
  
  this.arguments.forEach(function (expression) {
    place = expression.transform(place);
  });
  
  var newPlace;
  findContinuation(this.arguments, function (contExpr, contPos, options) {
    //Function call with cont
    var callbackPlace = [];
    contExpr.arguments.forEach(function (argument, index) {
      callbackPlace.push(new ExpressionStatement(
        new AssignmentExpression(
          '=',
          argument,
          new MemberExpression(new Identifier('arguments'), new Literal(index))
        )
      ));
    });
    
    if (options.obtain) {
      //Check and throw error
      var errIdentifier = new Identifier(helpers.errName);
      callbackPlace.push(new IfStatement(
        errIdentifier,
        new ThrowStatement(errIdentifier)
      ));
    }
    
    //Replace cont with a callback function
    var continuationFunc = new FunctionExpression(
      null,
      [],
      new BlockStatement(callbackPlace)
    );
    self.arguments[contPos] = continuationFunc;
    newPlace = callbackPlace;
  });
  if (newPlace) {
    return newPlace;
  }
  
  return place;
};

var findContinuation = function (args, callback) {
  //Todo check multiple cont && obtain
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg.type === 'CallExpression') {
      if (arg.callee.name === helpers.contName) {
        return callback(arg, i, {});
      } else if (arg.callee.name === helpers.obtainName) {
        return callback(arg, i, {obtain: true});
      }
    }
  }
  return -1;
};

CallExpression.prototype.transformParallel = function (place) {
  var ArrayExpression = require('./ArrayExpression');
  var BinaryExpression = require('./BinaryExpression');
  var UnaryExpression = require('./UnaryExpression');
  var ReturnStatement = require('./ReturnStatement');
  var ThrowStatement = require('./ThrowStatement');

  var self = this;
  var expPlaces = [];
  this.arguments.forEach(function (expression) {
    var expPlace = expression.transform(place);
    expPlaces.push(expPlace);
  });
  
  var numParallels = this.arguments.length;
  
  var innerPlace = [];
  var nextPlace = [];
  var parallelCounter = new Identifier(helpers.getParallelCountName());
  var callbackId = new Identifier(helpers.callbackName);
  var errId = new Identifier(helpers.errName);
  var errArray = new Identifier(helpers.getErrorArrayName());
  
  //Define var _$parallel_done = 0
  place.push(new VariableDeclaration(
    new VariableDeclarator(parallelCounter, new Literal(0)),
    'var'
  ));
  
  //Define var _$errors = []
  place.push(new VariableDeclaration(
    new VariableDeclarator(errArray, new ArrayExpression()),
    'var'
  ));

  for (var i = 0; i < numParallels; i++) {
    var expression = this.arguments[i];
    var expPlace = expPlaces[i];
    
    if (expPlace === undefined) {
      throw new Error('Call expression within parallel must contain a cont() or obtain() argument');
    }
    
    //Add _$parallel_done++
    expPlace.unshift(new ExpressionStatement(
      new UnaryExpression('++', parallelCounter)
    ));
    //Add _$cont()
    expPlace.push(new ExpressionStatement(
      new CallExpression(callbackId)
    ));
    innerPlace.push(new ExpressionStatement(expression));
  }
  
  //Add if (_$err) _$errors.push($_err)
  nextPlace.push(new IfStatement(
    errId,
    new ExpressionStatement(
      new CallExpression(
        new MemberExpression(errArray, new Identifier('push'), false),
        errId
      )
    )
  ));
  
  //Add if (_$parallel_done !== ...) return
  nextPlace.push(new IfStatement(
    new BinaryExpression('!==', parallelCounter, new Literal(numParallels)),
    new ReturnStatement()
  ));
  
  //Add if (_$errors.length > 0) throw $_errors
  nextPlace.push(new IfStatement(
    new BinaryExpression(
      '>', 
      new MemberExpression(errArray, new Identifier('length'), false),
      new Literal(0)),
    new ThrowStatement(errArray)
  ));
  
  //Add _$parallel_done = undefined, _$err = undefined, _$errors = undefined, in order to reduce side-effect
  nextPlace.push(new ExpressionStatement(
    new AssignmentExpression('=', parallelCounter, new Identifier('undefined'))
  ));
  nextPlace.push(new ExpressionStatement(
    new AssignmentExpression('=', errId, new Identifier('undefined'))
  ));
  nextPlace.push(new ExpressionStatement(
    new AssignmentExpression('=', errArray, new Identifier('undefined'))
  ));
  
  //function (_$cont)
  this.callee = new FunctionExpression(
    null,
    [callbackId],
    new BlockStatement(innerPlace)
  );
  //function (_$err)
  var errContinuation = new FunctionExpression(
    null,
    [errId],
    new BlockStatement(nextPlace)
  );
  this.arguments = [errContinuation];
  return nextPlace;
};
