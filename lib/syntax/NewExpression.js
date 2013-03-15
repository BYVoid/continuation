var util = require('util');

var NewExpression = module.exports = function (callee, args, loc, range) {
  this.type = 'NewExpression';
  this.callee = callee;
  this.arguments = args;
  if (!this.arguments) {
    this.arguments = [];
  }
  if (!util.isArray(this.arguments)) {
    this.arguments = [this.arguments];
  }
  this.loc = loc;
  this.range = range;
};

NewExpression.prototype.transform = function (place) {
  place = this.callee.transform(place);
  for (var i = 0; i < this.arguments.length; i++) {
    place = this.arguments[i].transform(place);
  }
  return place;
};
