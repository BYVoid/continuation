var Property = module.exports = function (key, value, kind, loc, range) {
  this.type = 'Property';
  this.key = key;
  this.value = value;
  this.kind = kind;
  this.loc = loc;
  this.range = range;
};

Property.prototype.normalize = function (place) {
  this.key.normalize(place);
  this.value.normalize(place);
};

Property.prototype.transform = function (place) {
  place = this.value.transform(place);
  return place;
};
