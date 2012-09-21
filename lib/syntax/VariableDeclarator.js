var VariableDeclarator = module.exports = function(id, init) {
  this.type = 'VariableDeclarator';
  this.id = id;
  this.init = init;
  this.async = false;
};
