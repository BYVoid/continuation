var assert = require('assert');

var BlockStatement = require('./BlockStatement');
var Identifier = require('./Identifier');
var VariableDeclaration = require('./VariableDeclaration');

var helpers = require('../helpers');

var IfStatement = module.exports = function (test, consequent, alternate, loc, range) {
  this.type = 'IfStatement';
  this.test = test;
  this.consequent = consequent;
  this.alternate = alternate;
  if (!this.alternate) {
    this.alternate = null;
  }
  this.loc = loc;
  this.range = range;
};

IfStatement.prototype.normalize = function () {
  //Add block this
  if (!this.consequent || this.consequent.type !== 'BlockStatement') {
    this.consequent = new BlockStatement(this.consequent);
  }
  if (this.alternate !== null && this.alternate.type !== 'BlockStatement') {
    this.alternate = new BlockStatement(this.alternate);
  }

  return this;
};

IfStatement.prototype.transform = function (place) {
  var BinaryExpression = require('./BinaryExpression');
  var CallExpression = require('./CallExpression');
  var ExpressionStatement = require('./ExpressionStatement');
  var ReturnStatement = require('./ReturnStatement');
  
  var consequentPlace = this.consequent.transform();
  var async = (consequentPlace != this.consequent.body);
  
  if (this.alternate !== null) {
    assert(this.alternate.type === 'BlockStatement');
    var alternatePlace = this.alternate.transform();
    async = async || (alternatePlace != this.alternate.body);
  }
  
  if (async) {
    var callbackStmt = new ExpressionStatement(
      new CallExpression(new Identifier(helpers.callbackName)
    ));
    
    consequentPlace.push(callbackStmt);
    if (this.alternate !== null) {
      alternatePlace.push(callbackStmt);
    } else {
      this.alternate = new BlockStatement(callbackStmt);
    }
  
    var nextPlace = [];
    var ifWrapper = helpers.makeCPS([this], nextPlace);
    var ifExpression = ifWrapper.expression;
    var ifContFunc = ifExpression.arguments[0];
    
    //Add err param for continuation function
    var errId = new Identifier(helpers.errName);
    ifContFunc.params = [errId];

    //if (_$err !== undefined) return _$cont($_err)
    var judgeErrorStatement = new IfStatement(
      new BinaryExpression('!==', errId, new Identifier('undefined')),
      new ReturnStatement(
        new CallExpression(new Identifier(helpers.callbackName), errId
      )),
      null
    );
    nextPlace.push(judgeErrorStatement);
    
    place.push(ifWrapper);
    return nextPlace;
  } else {
    //Not transfrom if no async calls
    place.push(this);
    return place;
  }
}
