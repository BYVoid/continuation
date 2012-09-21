var AssignmentExpression = require('./AssignmentExpression');

var AssignmentStatement = module.exports = function(left, right) {
  this.type = 'ExpressionStatement',
  this.expression = new AssignmentExpression('=', left, right);
};
