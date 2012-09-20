var BlockStatement = require('./BlockStatement');
var VariableDeclaration = require('./VariableDeclaration');
var helpers = require('../helpers');

var WhileStatement = module.exports = function(test, body) {
  this.type = 'WhileStatement';
  this.test = test;
  this.body = body;
};

WhileStatement.prototype.normalize = function (place) {
  if (this.body === null) {
    this.body = new BlockStatement([]);
  } else if (this.body.type !== 'BlockStatement') {
    this.body = new BlockStatement([this.body]);
  }
  
  this.body.normalize();
  
  //Move variable declarations outside
  var declarations = [];
  helpers.extractVariableDeclarations(this.body, declarations);
  declarations = helpers.reduceDeclarations(declarations);
  if (declarations.length > 0) {
    place.push(new VariableDeclaration(declarations, 'var'));
  }
  place.push(this);
};
