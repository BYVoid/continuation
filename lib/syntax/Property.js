var Property = module.exports = function (key, value, kind, loc, range) {
  this.type = 'Property';
  this.key = key;
  this.value = value;
  this.kind = kind;
  this.loc = loc;
  this.range = range;
};

Property.prototype.transform = function (place, aliases) {
  place = this.value.transform(place, aliases);
  return place;
};
