var SequenceExpression = module.exports = function (expressions, loc, range) {
  this.type = 'SequenceExpression',
  this.expressions = expressions;
  this.loc = loc;
  this.range = range;
};

SequenceExpression.prototype.normalize = function () {
  for (var i = 0; i < this.expressions.length; i++) {
    this.expressions[i].normalize();
  }
};

SequenceExpression.prototype.transform = function (place) {
  return place;
};
