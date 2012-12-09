var SwitchCase = module.exports = function (test, consequent, loc, range) {
  this.type = 'SwitchCase';
  this.test = test;
  this.consequent = consequent;
  this.loc = loc;
  this.range = range;
};
