var ThisExpression = module.exports = function (loc, range) {
  this.type = 'ThisExpression';
  this.async = false;
  this.loc = loc;
  this.range = range;
};

ThisExpression.prototype.normalize = function () {
};

ThisExpression.prototype.transform = function (place) {
  return place;
};
