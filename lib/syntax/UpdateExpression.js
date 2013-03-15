var UpdateExpression = module.exports = function (operator, argument, prefix, loc, range) {
  this.type = 'UpdateExpression';
  this.operator = operator;
  this.argument = argument;
  this.prefix = prefix;
  this.loc = loc;
  this.range = range;
};

UpdateExpression.prototype.transform = function(place) {
  place = this.argument.transform(place);
  return place;
};
