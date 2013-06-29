var ConditionalExpression = module.exports = function (test, consequent, alternate, loc, range) {
  this.type = 'ConditionalExpression';
  this.test = test;
  this.consequent = consequent;
  this.alternate = alternate;
  this.loc = loc;
  this.range = range;
};

ConditionalExpression.prototype.transform = function (place) {
  place = this.test.transform(place);
  place = this.consequent.transform(place);
  place = this.alternate.transform(place);
  return place;
};
