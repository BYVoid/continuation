var CatchClause = module.exports = function (param, guard, body, loc, range) {
  this.type = 'CatchClause';
  this.param = param;
  this.guard = guard;
  this.body = body;
  this.async = false;
  this.loc = loc;
  this.range = range;
};

CatchClause.prototype.transform = function (place) {
  var newPlace = this.body.transform(place);
  if (this.body.async) {
    this.async = true;
    return newPlace;
  }
  return place;
};
