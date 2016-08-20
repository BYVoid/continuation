var ObjectExpression = module.exports = function (properties, loc, range) {
  this.type = 'ObjectExpression';
  this.properties = properties;
  this.loc = loc;
  this.range = range;
};

ObjectExpression.prototype.transform = function (place, aliases) {
  for (var i = 0; i < this.properties.length; i++) {
    place = this.properties[i].transform(place, aliases);
  }
  return place;
};
