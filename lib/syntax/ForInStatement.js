var helpers = require('../helpers');

var ForInStatement = module.exports = function(left, right, body, each, loc, range) {
  this.type = 'ForInStatement';
  this.left = left;
  this.right = right;
  this.body = body;
  this.each = each;
  this.async = false;
  this.loc = loc;
  this.range = range;
};

ForInStatement.prototype.normalize = function (place) {
  var AssignmentExpression = require('./AssignmentExpression');
  var ArrayExpression = require('./ArrayExpression');
  var BinaryExpression = require('./BinaryExpression');
  var BlockStatement = require('./BlockStatement');
  var CallExpression = require('./CallExpression');
  var ExpressionStatement = require('./ExpressionStatement');
  var Identifier = require('./Identifier');
  var Literal = require('./Literal');
  var MemberExpression = require('./MemberExpression');
  var UnaryExpression = require('./UnaryExpression');
  var VariableDeclaration = require('./VariableDeclaration');
  var VariableDeclarator = require('./VariableDeclarator');
  var WhileStatement = require('./WhileStatement');
  
  this.left.normalize(place);
  if (this.left.type === 'VariableDeclaration') {
    this.left.forIn = true;
  }
  this.right.normalize(place);
  this.body.normalize(place);
  
  //Define additional temporary variables
  var iter = new Identifier(helpers.forInIter);
  var iterArray = new Identifier(helpers.forInArray);
  var iterDef = new VariableDeclaration(new VariableDeclarator(iter, new Literal(0)));
  var iterArrayDef = new VariableDeclaration(new VariableDeclarator(iterArray, new ArrayExpression));
  
  //Move actual iteration into a while loop
  var cond = new BinaryExpression('<', iter, new MemberExpression(iterArray, new Identifier('length'), false));
  var iteration = new WhileStatement(cond, this.body);
  this.body.body.unshift(new ExpressionStatement(
    new AssignmentExpression('=', this.left, new MemberExpression(iterArray, iter))
  ));
  this.body.body.push(new ExpressionStatement(
    new UnaryExpression('++', iter)
  ));
  
  //Export iteration result into a temporary array
  this.body = new BlockStatement([
    new ExpressionStatement(new CallExpression(
      new MemberExpression(iterArray, new Identifier('push'), false),
      this.left
    ))
  ]);
  
  place.push(iterArrayDef);
  place.push(this);
  place.push(iterDef);
  place.push(iteration);
};

ForInStatement.prototype.transform = function (place) {
  //Todo transform for in statement
  place.push(this);
  return place;
};
