var EmptyStatement = module.exports = function (loc, range) {
  this.type = 'EmptyStatement';
  this.async = false;
  this.loc = loc;
  this.range = range;
};

EmptyStatement.prototype.normalize = function () {
  return null;
};

EmptyStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
