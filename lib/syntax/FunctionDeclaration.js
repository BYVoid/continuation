var FunctionExpression = require('./FunctionExpression');

var FunctionDeclaration = module.exports = function (id, params, body, loc, range) {
  this.type = 'FunctionDeclaration';
  this.id = id;
  this.params = params;
  this.body = body;
  this.async = false;
  this.loc = loc;
  this.range = range;
};

FunctionDeclaration.prototype.normalize = FunctionExpression.prototype.normalize;

FunctionDeclaration.prototype.transform = function (place) {
  place = FunctionExpression.prototype.transform.call(this, place);
  place.push(this);
  return place;
};
