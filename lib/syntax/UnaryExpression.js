var UnaryExpression = module.exports = function (operator, argument, loc, range) {
  this.type = 'UnaryExpression',
  this.operator = operator;
  this.argument = argument;
  this.loc = loc;
  this.range = range;
};

UnaryExpression.prototype.transform = function (place, aliases) {
  place = this.argument.transform(place, aliases);
  return place;
};
