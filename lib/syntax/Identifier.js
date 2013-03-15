var Identifier = module.exports = function (name, loc, range) {
  this.type = 'Identifier';
  this.name = name;
  this.loc = loc;
  this.range = range;
};

Identifier.prototype.transform = function (place) {
  return place;
};
