var helpers = require('../helpers');

var CallExpression = module.exports = function(callee, args) {
  this.type = 'CallExpression';
  this.callee = callee;
  this.arguments = args;
};

CallExpression.prototype.transform = function (place) {
  if (this.callee.type === 'FunctionExpression') {
    this.callee.body.transform();
    if (this.callee.body.async) {
      this.async = true;
    }
  }
  
  this.arguments.forEach(function (expression) {
    if (expression.type === 'FunctionExpression') {
      expression.body.transform();
      if (expression.body.async) {
        this.async = true;
      }
    }
  });
  
  var newPlace = helpers.continuationToCallback(this.arguments);
  
  if (newPlace) {
    return newPlace;
  }
  return place;
};
