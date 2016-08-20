var ArrayExpression = module.exports = function (elements, loc, range) {
  this.type = 'ArrayExpression';
  this.elements = elements;
  if (!elements) {
    this.elements = [];
  }
  this.loc = loc;
  this.range = range;
};

ArrayExpression.prototype.transform = function (place, aliases) {
  for (var i = 0; i < this.elements.length; i++) {
    place = this.elements[i].transform(place, aliases);
  }
  return place;
};
