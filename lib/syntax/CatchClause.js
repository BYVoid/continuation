var CatchClause = module.exports = function (param, guard, body, loc, range) {
  this.type = 'CatchClause';
  this.param = param;
  this.guard = guard;
  this.body = body;
  this.loc = loc;
  this.range = range;
};

CatchClause.prototype.transform = function (place) {
  place = this.body.transform();
  return place;
};
