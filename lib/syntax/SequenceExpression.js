var SequenceExpression = module.exports = function(expressions) {
  this.type = 'SequenceExpression',
  this.expressions = expressions;
};

SequenceExpression.prototype.normalize = function () {
  for (var i = 0; i < this.expressions.length; i++) {
    this.expressions[i].normalize();
  }
};

SequenceExpression.prototype.transform = function (place) {
  return place;
};
