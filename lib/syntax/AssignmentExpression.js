var AssignmentExpression = module.exports = function (operator, left, right, loc, range) {
  this.type = 'AssignmentExpression',
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.loc = loc;
  this.range = range;
};

AssignmentExpression.prototype.transform = function (place) {
  place = this.left.transform(place);
  place = this.right.transform(place);
  return place;
};
