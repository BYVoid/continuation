var Property = module.exports = function(key, value, kind) {
  this.type = 'Property';
  this.key = key;
  this.value = value;
  this.kind = kind;
};

Property.prototype.normalize = function (place) {
  this.key.normalize(place);
  this.value.normalize(place);
};

Property.prototype.transform = function (place) {
  return place;
};
