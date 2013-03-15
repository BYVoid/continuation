var ContinueStatement = module.exports = function (label, loc, range) {
  this.type = 'ContinueStatement';
  this.label = label;
  this.loc = loc;
  this.range = range;
};

ContinueStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
