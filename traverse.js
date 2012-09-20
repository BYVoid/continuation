var traverse = module.exports = function(block, func) {
  for (var i = 0; i < block.body.length; i++) {
    var statement = block.body[i];
    if (statement.type === 'ExpressionStatement') {
      var expression = statement.expression;
      if (expression.type === 'CallExpression') {
        if (expression.callee.type === 'FunctionExpression') {
          traverse(expression.callee.body, func);
        }
        expression.arguments.forEach(function (argument) {
          if (argument.type === 'FunctionExpression') {
            traverse(argument.body, func);
          }
        });
      }
    } else if (statement.type === 'IfStatement') {
      traverse(statement.consequent, func);
      traverse(statement.alternate, func);
    }
    statement = func(statement);
    block.body[i] = statement;
  }
};
