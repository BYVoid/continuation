var traverse = require('../traverse');
var helpers = require('../helpers');
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
  this.body.normalize();
  var dec = helpers.extractVariableDeclarations(this.body);
  if (dec.declarations.length > 0) {
    this.body.body.pushFront(dec);
  }
};

FunctionExpression.prototype.transform = function (place) {
  this.body.transform(place);
  if (this.body.async) {
    this.async = true;
  }
  return place;
};
