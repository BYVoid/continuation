var LogicalExpression = module.exports = function (operator, left, right, loc, range) {
  this.type = 'LogicalExpression',
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.loc = loc;
  this.range = range;
};

LogicalExpression.prototype.transform = function (place) {
  place = this.left.transform(place);
  place = this.right.transform(place);
  return place;
};
