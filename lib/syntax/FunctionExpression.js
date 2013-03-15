var FunctionExpression = module.exports = function (id, params, body, loc, range) {
  this.type = 'FunctionExpression';
  this.id = id;
  this.params = params;
  this.body = body;
  this.loc = loc;
  this.range = range;
};

FunctionExpression.prototype.normalize = function () {
  var helpers = require('../helpers');
  var dec = helpers.extractVariableDeclarations(this.body);
  if (dec.declarations.length > 0) {
    this.body.body.unshift(dec);
  }
  return this;
};

FunctionExpression.prototype.transform = function (place) {
  this.body.transform();   // ignore new place
  return place;
};
