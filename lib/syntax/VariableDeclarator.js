var VariableDeclarator = module.exports = function(id, init) {
  this.type = 'VariableDeclarator';
  this.id = id;
  this.init = init;
  this.async = false;
};

VariableDeclarator.prototype.normalize = function() {
  if (this.init !== null) {
    this.init.normalize();
  }
};
