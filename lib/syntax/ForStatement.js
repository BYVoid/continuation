var Literal = require('./Literal');
var BlockStatement = require('./BlockStatement');
var WhileStatement = require('./WhileStatement');
var ExpressionStatement = require('./ExpressionStatement');
var VariableDeclaration = require('./VariableDeclaration');

var ForStatement = module.exports = function(init, test, update, body) {
  this.type = 'ForStatement';
  this.init = init;
  this.test = test;
  this.update = update;
  this.body = body;
  this.async = false;
};

ForStatement.prototype.normalize = function (place) {
  if (this.body === null) {
    this.body = new BlockStatement([]);
  } else if (this.body.type !== 'BlockStatement') {
    this.body = new BlockStatement([this.body]);
  }
  
  if (this.test === null) {
    this.test = new Literal(true);
  }
  
  if (this.update !== null) {
    this.body.body.push(new ExpressionStatement(this.update));
  }
  
  if (this.init !== null) {
    if (this.init.type === 'AssignmentExpression') {
      this.init = new ExpressionStatement(this.init);
    }
    place.push(this.init);
  }

  var whileStatement = new WhileStatement(this.test, this.body);
  whileStatement.normalize(place);
  whileStatement.update = this.update;
  this.transformedStatement = whileStatement;
}
