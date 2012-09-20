var BlockStatement = require('./BlockStatement');

var SwitchStatement = module.exports = function(discriminant, cases) {
  this.type = 'SwitchStatement';
  this.discriminant = discriminant;
  this.cases = cases;
};

SwitchStatement.prototype.normalize = function (body) {
  if (this.cases) {
    this.cases.forEach(function (sCase) {
      var block = new BlockStatement(sCase.consequent);
      block.normalize();
      sCase.consequent = block.body;
    });
  }
  body.push(this);
};
