var FunctionExpression = module.exports = function(id, params, body) {
  this.type = 'FunctionExpression';
  this.id = id;
  this.params = params;
  this.body = body;
};

FunctionExpression.prototype.transform = function (place) {
  place = this.right.transform(place);
  return place;
};
