var AssignmentExpression = module.exports = function(operator, left, right) {
  this.type = 'AssignmentExpression',
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.async = false;
};

AssignmentExpression.prototype.transform = function (place) {
  place = this.right.transform(place);
  if (this.right.async) {
    this.async = true;
  }
  return place;
};
