var FunctionDeclaration = module.exports = function(id, params, body) {
  this.type = 'FunctionDeclaration';
  this.id = id;
  this.params = params;
  this.body = body;
};
