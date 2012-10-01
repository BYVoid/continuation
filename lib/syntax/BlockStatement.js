var util = require('util');

var BlockStatement = module.exports = function(body) {
  this.type = 'BlockStatement';
  this.body = body;
  this.async = false;
  
  if (!util.isArray(this.body)) {
    this.body = [this.body];
  }
  
  for (var i = 0; i < this.body.length; i++) {
    if (this.body[i].async) {
      this.async = true;
    }
  }
};

BlockStatement.prototype.normalize = function () {
  var body = [];
  for (var i = 0; i < this.body.length; i++) {
    var statement = this.body[i];
    if (statement.type === 'ForStatement') {
      statement.normalize(body);
      statement = statement.transformedStatement;
    } else {
      statement.normalize(body);
    }
    this.body[i] = statement;
  }
  this.body = body;
};

BlockStatement.prototype.transform = function () {
  var newBody = [];
  var place = newBody;
  for (var i = 0; i < this.body.length; i++) {
    var statement = this.body[i];
    var newPlace = place;
    newPlace = statement.transform(place);
    if (newPlace !== place) {
      place = newPlace;
      this.async = true;
    }
  }
  this.body = newBody;
  return place;
};
