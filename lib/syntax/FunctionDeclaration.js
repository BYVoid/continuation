var FunctionExpression = require('./FunctionExpression');

var FunctionDeclaration = module.exports = function (id, params, body, loc, range) {
  this.type = 'FunctionDeclaration';
  this.id = id;
  this.params = params;
  this.body = body;
  this.loc = loc;
  this.range = range;
};

FunctionDeclaration.prototype.normalize = FunctionExpression.prototype.normalize;

FunctionDeclaration.prototype.transform = function (place, aliases) {
  place.push(this);
  place = FunctionExpression.prototype.transform.call(this, place, aliases);
  return place;
};
