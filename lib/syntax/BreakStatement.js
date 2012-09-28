var BreakStatement = module.exports = function(label) {
  this.type = 'BreakStatement';
  this.label = label;
};

BreakStatement.prototype.normalize = function (place) {
  place.push(this);
};

BreakStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
