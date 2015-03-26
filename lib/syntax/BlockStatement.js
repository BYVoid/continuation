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

BlockStatement.prototype.transform = function (outerPlace) {
  // move functions to the beginning
  var functions = this.body.filter(function(statement){
    return statement.type === "FunctionDeclaration";
  });
  var statements = this.body.filter(function(statement){
    return statement.type !== "FunctionDeclaration";
  });

  this.body = functions.concat(statements);

  // outerPlace is the outer place if this is a normal block statement,
  // and undefined if it's part of a bigger statement (if/while/try/...)
  var newBody = [];
  var place = outerPlace || newBody;
  for (var i = 0; i < this.body.length; i++) {
    place = this.body[i].transform(place);
  }
  this.body = newBody;
  return place;
};
