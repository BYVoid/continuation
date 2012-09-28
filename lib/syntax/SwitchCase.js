var SwitchCase = module.exports = function(test, consequent) {
  this.type = 'SwitchCase';
  this.test = test;
  this.consequent = consequent;
};
