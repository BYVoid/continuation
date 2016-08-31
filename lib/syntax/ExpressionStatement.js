var ExpressionStatement = module.exports = function (expression, loc, range) {
  this.type = 'ExpressionStatement';
  this.expression = expression;
  this.loc = loc;
  this.range = range;
};

ExpressionStatement.prototype.transform = function (place, aliases) {
  var newPlace = this.expression.transform(place, aliases);
  place.push(this);
  return newPlace;
};
