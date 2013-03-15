var Literal = module.exports = function (value, loc, range) {
  this.type = 'Literal';
  this.value = value;
  this.loc = loc;
  this.range = range;
};

Literal.prototype.transform = function (place) {
  return place;
};
