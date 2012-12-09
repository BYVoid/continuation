var UnaryExpression = module.exports = function (operator, argument, loc, range) {
  this.type = 'UnaryExpression',
  this.operator = operator;
  this.argument = argument;
  this.async = false;
  this.loc = loc;
  this.range = range;
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
