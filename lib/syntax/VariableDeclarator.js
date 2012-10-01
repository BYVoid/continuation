var VariableDeclarator = module.exports = function(id, init) {
  this.type = 'VariableDeclarator';
  this.id = id;
  this.init = init;
  this.async = false;
  if (!this.init) {
    this.init = null;
  }
};

VariableDeclarator.prototype.normalize = function() {
  if (this.init !== null) {
    this.init.normalize();
  }
};
