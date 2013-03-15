var util = require('util');

var BlockStatement = module.exports = function (body, loc, range) {
  this.type = 'BlockStatement';
  this.body = body;
  
  if (!this.body) {
    this.body = [];
  }
  if (!util.isArray(this.body)) {
    this.body = [this.body];
  }
  this.loc = loc;
  this.range = range;
};

BlockStatement.prototype.transform = function () {
  var newBody = [];
  var place = newBody;
  for (var i = 0; i < this.body.length; i++) {
    place = this.body[i].transform(place);
  }
  this.body = newBody;
  return place;
};
