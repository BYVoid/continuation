var ConditionalExpression = module.exports = function (test, consequent, alternate, loc, range) {
  this.type = 'ConditionalExpression';
  this.test = test;
  this.consequent = consequent;
  this.alternate = alternate;
  this.loc = loc;
  this.range = range;
};

ConditionalExpression.prototype.transform = function (place, aliases) {
  place = this.test.transform(place, aliases);
  place = this.consequent.transform(place, aliases);
  place = this.alternate.transform(place, aliases);
  return place;
};
