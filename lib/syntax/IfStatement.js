var BlockStatement = require('./BlockStatement');
var VariableDeclaration = require('./VariableDeclaration');
var helpers = require('../helpers');

var IfStatement = module.exports = function(test, consequent, alternate) {
  this.type = 'IfStatement';
  this.test = test;
  this.consequent = consequent;
  this.alternate = alternate;
  this.async = false;
};

IfStatement.prototype.normalize = function (place) {
  //Add block this
  if (this.consequent.type !== 'BlockStatement') {
    this.consequent = new BlockStatement([this.consequent]);
  }
  this.consequent.normalize();
  if (this.alternate !== null) {
    if (this.alternate.type !== 'BlockStatement') {
      this.alternate = new BlockStatement([this.alternate]);
    }
    this.alternate.normalize();
  }
  
  //Move variable declarations outside
  var declarations = [];
  helpers.extractVariableDeclarations(this.consequent, declarations);
  if (this.alternate !== null) {
    helpers.extractVariableDeclarations(this.alternate, declarations);
  }
  declarations = helpers.reduceDeclarations(declarations);
  if (declarations.length > 0) {
    place.push(new VariableDeclaration(declarations, 'var'));
  }
  place.push(this);
};

IfStatement.prototype.transform = function (place) {
  var consequentPlace = this.consequent.transform();
  this.async = this.async || this.consequent.async;
  
  if (this.alternate !== null) {
    var alternatePlace = this.alternate.transform();
    this.async = this.async || this.alternate.async;
  }
  
  if (this.async) {
    consequentPlace.push(helpers.continuationStatement);
    if (this.alternate !== null) {
      alternatePlace.push(helpers.continuationStatement);
    } else {
      this.alternate = new BlockStatement(helpers.continuationStatement);
    }
  
    var nextPlace = [];
    place.push(helpers.makeCPS([this], nextPlace));
    return nextPlace;
  }
  
  //Not transfrom if no async calls
  place.push(this);
  return place;
}
