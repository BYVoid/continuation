var BinaryExpression = module.exports = function (operator, left, right, loc, range) {
  this.type = 'BinaryExpression',
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.async = false;
  this.loc = loc;
  this.range = range;
};

BinaryExpression.prototype.transform = function (place) {
  place = this.left.transform(place);
  place = this.right.transform(place);
  if (this.left.async || this.right.async) {
    this.async = true;
  }
  return place;
};
