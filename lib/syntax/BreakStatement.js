var BreakStatement = module.exports = function(label) {
  this.type = 'BreakStatement';
  this.label = label;
};

BreakStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
