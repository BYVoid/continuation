var SequenceExpression = module.exports = function (expressions, loc, range) {
  this.type = 'SequenceExpression',
  this.expressions = expressions;
  this.loc = loc;
  this.range = range;
};

SequenceExpression.prototype.transform = function (place) {
  return place;
};
