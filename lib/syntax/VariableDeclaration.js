var VariableDeclaration = module.exports = function(declarations, kind) {
  this.type = 'VariableDeclaration';
  this.declarations = declarations;
  this.kind = kind;
};
