var BlockStatement = require('./BlockStatement');
var CallExpression = require('./CallExpression');
var ExpressionStatement = require('./ExpressionStatement');
var FunctionDeclaration = require('./FunctionDeclaration');
var Identifier = require('./Identifier');
var ReturnStatement = require('./ReturnStatement');
var helpers = require('../helpers');
var traverse = require('../traverse');

var SwitchStatement = module.exports = function(discriminant, cases) {
  this.type = 'SwitchStatement';
  this.discriminant = discriminant;
  this.cases = cases;
};

SwitchStatement.prototype.normalize = function (body) {
  if (this.cases) {
    this.cases.forEach(function (sCase) {
      var block = new BlockStatement(sCase.consequent);
      block.normalize();
      sCase.consequent = block.body;
    });
  }
  body.push(this);
};

SwitchStatement.prototype.transform = function (place) {
  var innerPlace = [];
  var caseFunctions = [];
  var casePlaces = [];
  var async = false;
  //Make case function form cases
  if (this.cases) {
    this.cases.forEach(function (sCase, index) {
      var name = 'case_' + index;
      var func = new FunctionDeclaration(
        new Identifier(name),
        [new Identifier(helpers.continuationIdentifier)],
        new BlockStatement(sCase.consequent)
      );
      
      var place = func.body.transform();
      async = async || func.body.async;
      casePlaces.push(place);
      caseFunctions.push(func);
      innerPlace.push(func);
    });
  }
  
  if (!async) {
    //No need to transform
    place.push(this);
    return place;
  }
  this.async = true;
  
  //Replace thiss in cases with case function calls
  this.cases.forEach(function (sCase, index) {
    var name = 'case_' + index;
    var continuationExpression = new CallExpression(new Identifier(name), [new Identifier(helpers.continuationIdentifier)]);
    sCase.consequent = [
      new ReturnStatement(continuationExpression),
    ];
  });
  
  caseFunctions.forEach(function (func, index) {
    var nextFunc = null;
    if (index !== caseFunctions.length - 1) {
      nextFunc = caseFunctions[index + 1];
    }
    var place = casePlaces[index];
    place.forEach(function (statement, i) {
      //Transform break this into cont()
      if (statement.type === 'BreakStatement') {
        place[i] = helpers.continuationStatement;
      }
    });
    if (place.length === 0 || !helpers.isContinuationStatement(place[place.length - 1])) {
      //No break in the end, fall through into next case function
      if (nextFunc !== null) {
        place.push(new ExpressionStatement(new CallExpression(nextFunc.id, [new Identifier(helpers.continuationIdentifier)])));
      } else {
        place.push(helpers.continuationStatement);
      }
    }
    
    traverse(func.body, function (statement) {
      if (statement.type === 'BreakStatement') {
        statement = new ReturnStatement(helpers.continuationStatement.expression);
      } 
      return statement;
    });
  });
  
  //Add switch this into inner place
  innerPlace.push(this);
  
  var nextPlace = [];
  place.push(helpers.makeCPS(innerPlace, nextPlace));
  
  return nextPlace;
};
