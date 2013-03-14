var util = require('util');
var helpers = require('../helpers');

var VariableDeclaration = module.exports = function (declarations, kind, loc, range) {
  this.type = 'VariableDeclaration';
  this.declarations = declarations;
  this.kind = kind;
  this.async = false;
  if (!util.isArray(this.declarations)) {
    this.declarations = [this.declarations];
  }
  if (!this.kind) {
    this.kind = 'var';
  }
  this.loc = loc;
  this.range = range;
};

VariableDeclaration.prototype.transform = function(place) {
  place.push(this);
  return place;
};
