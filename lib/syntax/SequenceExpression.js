var SequenceExpression = module.exports = function (expressions, loc, range) {
  this.type = 'SequenceExpression',
  this.expressions = expressions;
  this.loc = loc;
  this.range = range;
};

SequenceExpression.prototype.transform = function (place) {
  for (var i = 0; i < this.expressions.length; i++) {
    place = this.expressions[i].transform(place);
  }
  return place;
};
