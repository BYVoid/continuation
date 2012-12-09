var helpers = require('../helpers');
var BlockStatement = require('./BlockStatement');

var Program = module.exports = function (body, comments, loc, range) {
  this.type = 'Program';
  this.body = body;
  this.comments = comments;
  this.loc = loc;
  this.range = range;
};

Program.prototype.normalize = function (place) {
  BlockStatement.prototype.normalize.call(this, place);
  
  var dec = helpers.extractVariableDeclarations(this);
  if (dec.declarations.length > 0) {
    this.body.unshift(dec);
  }

};

Program.prototype.transform = BlockStatement.prototype.transform;
