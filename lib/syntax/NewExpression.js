var util = require('util');

var NewExpression = module.exports = function(callee, args) {
  this.type = 'NewExpression';
  this.callee = callee;
  this.arguments = args;
  if (!this.arguments) {
    this.arguments = [];
  }
  if (!util.isArray(this.arguments)) {
    this.arguments = [this.arguments];
  }
};

NewExpression.prototype.normalize = function (place) {
  this.callee.normalize(place);
};

NewExpression.prototype.transform = function (place) {
  return place;
};
