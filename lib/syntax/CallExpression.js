var util = require('util');
var helpers = require('../helpers');
var AssignmentExpression = require('./AssignmentExpression');
var BlockStatement = require('./BlockStatement');
var ExpressionStatement = require('./ExpressionStatement');
var FunctionExpression = require('./FunctionExpression');
var Identifier = require('./Identifier');
var Literal = require('./Literal');
var MemberExpression = require('./MemberExpression');
var VariableDeclaration = require('./VariableDeclaration');
var VariableDeclarator = require('./VariableDeclarator');

var CallExpression = module.exports = function(callee, args) {
  this.type = 'CallExpression';
  this.callee = callee;
  this.arguments = args;
  if (!this.arguments) {
    this.arguments = [];
  }
  if (!util.isArray(this.arguments)) {
    this.arguments = [this.arguments];
  }
};

CallExpression.prototype.normalize = function (place) {
  var self = this;
  this.callee.normalize();
  //return;
  findContinuation(this.arguments, function (contPos) {
    //Function call with continuation
    var contExpr = self.arguments[contPos];
    contExpr.arguments.forEach(function (argument, index) {
      //Declare argument variable if not defined
      place.push(new VariableDeclaration(
        new VariableDeclarator(
          argument
        )
      ));
    });
  });
};

CallExpression.prototype.transform = function (place) {
  var self = this;
  
  if (this.callee.type === 'FunctionExpression') {
    this.callee.body.transform();
    if (this.callee.body.async) {
      this.async = true;
    }
  }
  
  this.arguments.forEach(function (expression) {
    if (expression.type === 'FunctionExpression') {
      expression.body.transform();
      if (expression.body.async) {
        this.async = true;
      }
    }
  });
  
  var newPlace;
  findContinuation(this.arguments, function (contPos) {
    //Function call with continuation
    var contExpr = self.arguments[contPos];
    var callbackBlock = [];
    contExpr.arguments.forEach(function (argument, index) {
      callbackBlock.push(new ExpressionStatement(
        new AssignmentExpression(
          '=',
          argument,
          new MemberExpression(new Identifier('arguments'), new Literal(index))
        )
      ));
    });
    
    //Replace continuation with a callback function
    self.arguments[contPos] = new FunctionExpression(
      null,
      [],
      new BlockStatement(callbackBlock)
    );
    self.async = true;
    newPlace = callbackBlock;
  });
  if (newPlace) {
    return newPlace;
  }
  
  return place;
};

var findContinuation = function (args, callback) {
  //Todo check multiple continuations && defer
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg.type === 'CallExpression' && arg.callee.name === 'continuation') {
      return callback(i);
    }
  }
  return -1;
};
