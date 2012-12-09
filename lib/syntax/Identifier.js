var Identifier = module.exports = function (name, loc, range) {
  this.type = 'Identifier';
  this.name = name;
  this.async = false;
  this.loc = loc;
  this.range = range;
};

Identifier.prototype.normalize = function () {
};

Identifier.prototype.transform = function (place) {
  return place;
};
