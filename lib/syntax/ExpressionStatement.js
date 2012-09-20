var ExpressionStatement = module.exports = function(expression) {
  this.type = 'ExpressionStatement';
  this.expression = expression;
};

ExpressionStatement.prototype.normalize = function (place) {
  var expression = this.expression;
  if (expression.type === 'CallExpression') {
    if (expression.callee.type === 'FunctionExpression') {
      expression.callee.body.normalize();
    }
    expression.arguments.forEach(function (arg) {
      if (arg.type === 'FunctionExpression') {
        arg.body.normalize();
      }
    });
  }
  place.push(this);
};
