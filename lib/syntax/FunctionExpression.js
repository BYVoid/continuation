var traverse = require('../traverse');
var Identifier = require('./Identifier');
var VariableDeclaration = require('./VariableDeclaration');
var VariableDeclarator = require('./VariableDeclarator');

var FunctionExpression = module.exports = function(id, params, body) {
  this.type = 'FunctionExpression';
  this.id = id;
  this.params = params;
  this.body = body;
};

FunctionExpression.prototype.normalize = function (place) {
  /*
  console.log(traverse.getIdentifiersInBlock(this.body));
  var argumentsVariable = new Identifier(this.id.name + 'Arguments');
  var s = new VariableDeclaration([new VariableDeclarator(argumentsVariable , new Identifier('arguments'))], 'var');
  this.body.body.reverse();
  this.body.body.push(s);
  this.body.body.reverse();
  */
  this.body.normalize();
  //place.push(this);
};

FunctionExpression.prototype.transform = function (place) {
  this.body.transform(place);
  if (this.body.async) {
    this.async = true;
  }
  return place;
};
