var ThrowStatement = module.exports = function(argument) {
  this.type = 'ThrowStatement';
  this.argument = argument;
  this.async = false;
};

ThrowStatement.prototype.normalize = function (place) {
  place.push(this);
  return place;
};

ThrowStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
