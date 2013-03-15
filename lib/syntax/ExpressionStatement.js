var ExpressionStatement = module.exports = function (expression, loc, range) {
  this.type = 'ExpressionStatement';
  this.expression = expression;
  this.loc = loc;
  this.range = range;
};

ExpressionStatement.prototype.transform = function (place) {
  var newPlace = this.expression.transform(place);
  place.push(this);
  return newPlace;
};
