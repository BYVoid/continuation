var ObjectExpression = module.exports = function(properties) {
  this.type = 'ObjectExpression';
  this.properties = properties;
};

ObjectExpression.prototype.normalize = function (place) {
  for (var i = 0; i < this.properties.length; i++) {
    this.properties[i].normalize(place);
  }
};

ObjectExpression.prototype.transform = function (place) {
  for (var i = 0; i < this.properties.length; i++) {
    place = this.properties[i].transform(place);
  }
  return place;
};
