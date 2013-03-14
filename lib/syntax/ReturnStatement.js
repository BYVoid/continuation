var ReturnStatement = module.exports = function (argument, loc, range) {
  this.type = 'ReturnStatement';
  this.argument = argument;
  this.async = false;
  this.loc = loc;
  this.range = range;
};

ReturnStatement.prototype.transform = function (place) {
  place.push(this);
  if (this.argument !== null) {
    place = this.argument.transform(place);
  }
  return place;
};
