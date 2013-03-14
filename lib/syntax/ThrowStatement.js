var ThrowStatement = module.exports = function (argument, loc, range) {
  this.type = 'ThrowStatement';
  this.argument = argument;
  this.async = false;
  this.loc = loc;
  this.range = range;
};

ThrowStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
