var ExpressionStatement = module.exports = function(expression) {
  this.type = 'ExpressionStatement';
  this.expression = expression;
};

ExpressionStatement.prototype.normalize = function (place) {
  this.expression.normalize(place);
  place.push(this);
};

ExpressionStatement.prototype.transform = function (place) {
  var newPlace = this.expression.transform(place);
  if (this.expression.async) {
    this.async = true;
  }
  place.push(this);
  return newPlace;
};
