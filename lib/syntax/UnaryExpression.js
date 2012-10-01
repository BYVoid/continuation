var UnaryExpression = module.exports = function(operator, argument) {
  this.type = 'UnaryExpression',
  this.operator = operator;
  this.argument = argument;
  this.async = false;
};

UnaryExpression.prototype.normalize = function (place) {
  this.argument.normalize(place);
};

UnaryExpression.prototype.transform = function (place) {
  place = this.argument.transform(place);
  if (this.argument.async) {
    this.async = true;
  }
  return place;
};
