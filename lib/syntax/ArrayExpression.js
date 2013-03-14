var ArrayExpression = module.exports = function (elements, loc, range) {
  this.type = 'ArrayExpression';
  this.elements = elements;
  if (!elements) {
    this.elements = [];
  }
  this.loc = loc;
  this.range = range;
};

ArrayExpression.prototype.transform = function (place) {
  return place;
};
