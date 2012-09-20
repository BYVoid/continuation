var CallExpression = module.exports = function(callee, args) {
  this.type = 'CallExpression';
  this.callee = callee;
  this.arguments = args;
};
