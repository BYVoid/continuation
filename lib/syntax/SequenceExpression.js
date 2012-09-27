var SequenceExpression = module.exports = function(expressions) {
  this.type = 'SequenceExpression',
  this.expressions = expressions;
};

SequenceExpression.prototype.transform = function (place) {
  return place;
};
