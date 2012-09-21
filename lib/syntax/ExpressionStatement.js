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

ExpressionStatement.prototype.transform = function (place) {
  var newPlace = this.expression.transform(place);
  if (this.expression.async) {
    this.async = true;
  }
  place.push(this);
  return newPlace;
};
