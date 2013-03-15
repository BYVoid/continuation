var EmptyStatement = module.exports = function (loc, range) {
  this.type = 'EmptyStatement';
  this.loc = loc;
  this.range = range;
};

EmptyStatement.prototype.normalize = function () {
  return null;
};

EmptyStatement.prototype.transform = function (place) {
  return place;
};
