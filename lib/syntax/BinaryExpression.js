var BinaryExpression = module.exports = function (operator, left, right, loc, range) {
  this.type = 'BinaryExpression',
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.loc = loc;
  this.range = range;
};

BinaryExpression.prototype.transform = function (place, aliases) {
  place = this.left.transform(place, aliases);
  place = this.right.transform(place, aliases);
  return place;
};
