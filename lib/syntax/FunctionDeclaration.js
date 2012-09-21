var FunctionDeclaration = module.exports = function(id, params, body) {
  this.type = 'FunctionDeclaration';
  this.id = id;
  this.params = params;
  this.body = body;
  this.async = false;
};

FunctionDeclaration.prototype.transform = function (place) {
  this.body.transform();
  if (this.body.async) {
    this.async = true;
  }
  place.push(statement);
  return place;
};
