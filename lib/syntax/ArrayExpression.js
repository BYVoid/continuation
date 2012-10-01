var ArrayExpression = module.exports = function(elements) {
  this.type = 'ArrayExpression';
  this.elements = elements;
};

ArrayExpression.prototype.normalize = function (place) {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].normalize(place);
  }
};

ArrayExpression.prototype.transform = function (place) {
  return place;
};
