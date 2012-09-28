var EmptyStatement = module.exports = function() {
  this.type = 'EmptyStatement';
  this.async = false;
};

EmptyStatement.prototype.normalize = function () {
};

EmptyStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
