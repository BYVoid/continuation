var ThisExpression = module.exports = function (loc, range) {
  this.type = 'ThisExpression';
  this.loc = loc;
  this.range = range;
};

ThisExpression.prototype.transform = function (place) {
  return place;
};
