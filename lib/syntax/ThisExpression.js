var ThisExpression = module.exports = function() {
  this.type = 'ThisExpression';
  this.async = false;
};

ThisExpression.prototype.normalize = function () {
};

ThisExpression.prototype.transform = function (place) {
  return place;
};
