var DebuggerStatement = module.exports = function (loc, range) {
  this.type = 'DebuggerStatement';
  this.loc = loc;
  this.range = range;
};

DebuggerStatement.prototype.transform = function (place) {
  place.push(this);
  return place;
};
