var BreakStatement = module.exports = function (label, loc, range) {
  this.type = 'BreakStatement';
  this.label = label;
  this.loc = loc;
  this.range = range;
};

BreakStatement.prototype.normalize = function (place) {
  place.push(this);
};

BreakStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
