var ContinueStatement = module.exports = function(label) {
  this.type = 'ContinueStatement';
  this.label = label;
};

ContinueStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
