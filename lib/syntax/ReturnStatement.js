var ReturnStatement = module.exports = function (argument, loc, range) {
  this.type = 'ReturnStatement';
  this.argument = argument;
  this.loc = loc;
  this.range = range;
};

ReturnStatement.prototype.transform = function (place, aliases) {
  place.push(this);
  if (this.argument !== null) {
    place = this.argument.transform(place, aliases);
  }
  return place;
};
