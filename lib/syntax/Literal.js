var Literal = module.exports = function(value) {
  this.type = 'Literal';
  this.value = value;
  this.async = false;
};

Literal.prototype.normalize = function () {
};

Literal.prototype.transform = function (place) {
  return place;
};
