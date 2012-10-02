var ForInStatement = module.exports = function(left, right, body, each) {
  this.type = 'ForInStatement';
  this.left = left;
  this.right = right;
  this.body = body;
  this.each = each;
  this.async = false;
};

ForInStatement.prototype.normalize = function (place) {
  this.left.normalize(place);
  if (this.left.type === 'VariableDeclaration') {
    this.left.forIn = true;
  }
  this.right.normalize(place);
  this.body.normalize(place);
  place.push(this);
};

ForInStatement.prototype.transform = function (place) {
  //Todo transform for in statement
  place.push(this);
  return place;
};
