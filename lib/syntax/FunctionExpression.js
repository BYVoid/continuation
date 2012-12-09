var FunctionExpression = module.exports = function (id, params, body, loc, range) {
  this.type = 'FunctionExpression';
  this.id = id;
  this.params = params;
  this.body = body;
  this.loc = loc;
  this.range = range;
};

FunctionExpression.prototype.normalize = function (place) {
  var helpers = require('../helpers');
  this.body.normalize();
  var dec = helpers.extractVariableDeclarations(this.body);
  if (dec.declarations.length > 0) {
    this.body.body.unshift(dec);
  }
};

FunctionExpression.prototype.transform = function (place) {
  this.body.transform(place);
  if (this.body.async) {
    this.async = true;
  }
  return place;
};
