var Assignment = module.exports = function(left, right) {
  this.type = 'ExpressionStatement',
  this.expression = {
    type: 'AssignmentExpression',
    operator: '=',
    left: left,
    right: right,
  };
};
