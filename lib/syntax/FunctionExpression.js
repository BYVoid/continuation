var FunctionExpression = module.exports = function(id, params, body) {
  this.type = 'FunctionExpression';
  this.id = id;
  this.params = params;
  this.body = body;
};

FunctionExpression.prototype.transform = function (place) {
  this.body.transform(place);
  if (this.body.async) {
    this.async = true;
  }
  return place;
};
