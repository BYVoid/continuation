var UpdateExpression = module.exports = function(operator, argument, prefix) {
  this.type = 'UpdateExpression';
  this.operator = operator;
  this.argument = argument;
  this.prefix = prefix;
};

UpdateExpression.prototype.transform = function(place) {
  return place;
};
