var CallStatement = module.exports = function(callee, args) {
  this.type = 'ExpressionStatement';
  this.expression = {
    type: 'CallExpression',
    callee: callee,
    arguments: args,
  };
};
