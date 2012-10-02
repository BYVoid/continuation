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
  findContinuation(this.arguments, function (contExpr, contPos, options) {
    if (options.obtain) {
      //Support obtain statement
      contExpr.arguments.unshift(new Identifier(helpers.errName));
    }
    
    contExpr.arguments.forEach(function (argument, index) {
      //Declare argument variable if not defined
      if (argument.type === 'MemberExpression') {
        argument = argument.object;
      }
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
  
  this.callee.transform();
  if (this.callee.async) {
    this.async = true;
  }
  
  this.arguments.forEach(function (expression) {
    expression.transform();
    if (expression.async) {
      this.async = true;
    }
  });
  
  var newPlace;
  findContinuation(this.arguments, function (contExpr, contPos, options) {
    //Function call with cont
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
    
    if (options.obtain) {
      //Check and throw error
      var errIdentifier = new Identifier(helpers.errName);
      callbackBlock.push(new IfStatement(
        errIdentifier,
        new ThrowStatement(errIdentifier)
      ));
    }
    
    //Replace cont with a callback function
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
  //Todo check multiple cont && obtain
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg.type === 'CallExpression') {
      if (arg.callee.name === 'cont') {
        return callback(arg, i, {});
      } else if (arg.callee.name === 'obtain') {
        return callback(arg, i, {obtain: true});
      }
    }
  }
  return -1;
};
