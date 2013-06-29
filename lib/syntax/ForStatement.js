var Literal = require('./Literal');
var BlockStatement = require('./BlockStatement');
var WhileStatement = require('./WhileStatement');
var ExpressionStatement = require('./ExpressionStatement');
var VariableDeclaration = require('./VariableDeclaration');

var ForStatement = module.exports = function (init, test, update, body, loc, range) {
  this.type = 'ForStatement';
  this.init = init;
  this.test = test;
  this.update = update;
  this.body = body;
  this.loc = loc;
  this.range = range;
};

ForStatement.prototype.normalize = function () {
  var result = [];

  if (!this.body || this.body.type !== 'BlockStatement') {
    this.body = new BlockStatement(this.body);
  }
  
  if (this.test === null) {
    this.test = new Literal(true);
  }
  
  if (this.update !== null) {
    this.body.body.push(new ExpressionStatement(this.update));
  }
  
  if (this.init !== null) {
    if (this.init.type !== 'VariableDeclaration') {
      this.init = new ExpressionStatement(this.init);
    }
    result.push(this.init);
  }

  var whileStatement = new WhileStatement(this.test, this.body);
  whileStatement.update = this.update;
  result.push(whileStatement);

  return result;
};
