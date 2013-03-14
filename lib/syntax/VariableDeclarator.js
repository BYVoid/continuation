var VariableDeclarator = module.exports = function (id, init, loc, range) {
  this.type = 'VariableDeclarator';
  this.id = id;
  this.init = init;
  this.async = false;
  if (!this.init) {
    this.init = null;
  }
  this.loc = loc;
  this.range = range;
};
