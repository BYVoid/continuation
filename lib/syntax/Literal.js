var Literal = module.exports = function (value, loc, range) {
  this.type = 'Literal';
  this.value = value;
  this.async = false;
  this.loc = loc;
  this.range = range;
};

Literal.prototype.normalize = function () {
};

Literal.prototype.transform = function (place) {
  return place;
};
