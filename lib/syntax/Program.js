var helpers = require('../helpers');
var BlockStatement = require('./BlockStatement');
var VariableDeclaration = require('./VariableDeclaration');

var Program = module.exports = function(body, comments) {
  this.type = 'Program';
  this.body = body;
  this.comments = comments;
};

Program.prototype.normalize = function (place) {
  BlockStatement.prototype.normalize.call(this, place);
  
  var dec = helpers.extractVariableDeclarations(this);
  if (dec.declarations.length > 0) {
    this.body.unshift(dec);
  }

};

Program.prototype.transform = BlockStatement.prototype.transform;
