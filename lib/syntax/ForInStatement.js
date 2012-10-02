var ForInStatement = module.exports = function(left, right, body, each) {
  this.type = 'ForInStatement';
  this.left = left;
  this.right = right;
  this.body = body;
  this.each = each;
};

ForInStatement.prototype.normalize = function (place) {
  this.left.normalize(place);
  this.right.normalize(place);
  this.body.normalize(place);
  place.push(this);
};

ForInStatement.prototype.transform = function (place) {
  //Todo transform for in statement
  place.push(this);
  return place;
};
