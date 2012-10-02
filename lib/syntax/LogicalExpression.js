var LogicalExpression = module.exports = function(operator, left, right) {
  this.type = 'LogicalExpression',
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.async = false;
};

LogicalExpression.prototype.normalize = function () {
  this.left.normalize();
  this.right.normalize();
};

LogicalExpression.prototype.transform = function (place) {
  place = this.left.transform(place);
  place = this.right.transform(place);
  if (this.left.async || this.right.async) {
    this.async = true;
  }
  return place;
};
