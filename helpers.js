var assert = require('assert');
var syntax = require('./syntax');

var reduceDeclarations = exports.reduceDeclarations = function (declarations) {
  var decMap = {};
  declarations.forEach(function (dec) {
    decMap[dec.id.name] = dec;
  });
  declarations = [];
  Object.keys(decMap).forEach(function (name) {
    var dec = decMap[name];
    dec.init = null;
    declarations.push(dec);
  });
  return declarations;
}

var extractVariableDeclarations = exports.extractVariableDeclarations = function (block, declarations) {
  var normalStatements = [];
  block.body.forEach(function (statement) {
    if (statement.type === 'VariableDeclaration') {
      statement.declarations.forEach(function (dec) {
        declarations.push(dec);
        if (dec.init !== null) {
          normalStatements.push(new syntax.Assignment(dec.id, dec.init));
        }
      });
    } else {
      normalStatements.push(statement);
    }
  });
  block.body = normalStatements;
}
