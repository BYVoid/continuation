var assert = require('assert');
var syntax = require('./syntax');

var normalizeBlock = exports.normalizeBlock = function (block) {
  var body = [];
  for (var i = 0; i < block.body.length; i++) {
    var statement = block.body[i];
    if (statement.type === 'IfStatement') {
      normalizeIf(statement, body);
    } else if (statement.type === 'ForStatement') {
      normalizeFor(statement, body);
    } else if (statement.type === 'WhileStatement') {
      normalizeWhile(statement, body);
    } else if (statement.type === 'SwitchStatement') {
      normalizeSwitch(statement, body);
    } else {
      body.push(statement);
    }
  }
  block.body = body;
}

function normalizeSwitch(statement, body) {
  statement.cases.forEach(function (sCase) {
    var block = new syntax.BlockStatement(sCase.consequent);
    normalizeBlock(block);
    sCase.consequent = block.body;
  });
  body.push(statement);
}

function reduceDeclarations(declarations) {
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

function extractVariableDeclarations(block, declarations) {
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

function normalizeIf(statement, place) {
  //Add block statement
  if (statement.consequent.type !== 'BlockStatement') {
    statement.consequent = new syntax.BlockStatement([statement.consequent]);
  }
  normalizeBlock(statement.consequent);
  if (statement.alternate === null) {
    statement.alternate = new syntax.BlockStatement([]);
  } else if (statement.alternate.type !== 'BlockStatement') {
    statement.alternate = new syntax.BlockStatement([statement.alternate]);
  }
  normalizeBlock(statement.alternate);
  
  //Move variable declarations outside
  var declarations = [];
  extractVariableDeclarations(statement.consequent, declarations);
  extractVariableDeclarations(statement.alternate, declarations);
  declarations = reduceDeclarations(declarations);
  if (declarations.length > 0) {
    place.push(new syntax.VariableDeclaration(declarations, 'var'));
  }
  place.push(statement);
}

function normalizeWhile(statement, place) {
  if (statement.body === null) {
    statement.body = new syntax.BlockStatement([]);
  } else if (statement.body.type !== 'BlockStatement') {
    statement.body = new syntax.BlockStatement([statement.body]);
  }
  
  normalizeBlock(statement.body);
  
  //Move variable declarations outside
  var declarations = [];
  extractVariableDeclarations(statement.body, declarations);
  declarations = reduceDeclarations(declarations);
  if (declarations.length > 0) {
    place.push(new syntax.VariableDeclaration(declarations, 'var'));
  }
  place.push(statement);
}

function normalizeFor(statement, place) {
  statement.type = 'WhileStatement';
  if (statement.body === null) {
    statement.body = new syntax.BlockStatement([]);
  } else if (statement.body.type !== 'BlockStatement') {
    statement.body = new syntax.BlockStatement([statement.body]);
  }
  
  if (statement.test === null) {
    statement.test = new syntax.Literal(true);
  }
  
  if (statement.update !== null) {
    statement.body.body.push(new syntax.ExpressionStatement(statement.update));
  }
  
  if (statement.init !== null) {
    if (statement.init.type === 'AssignmentExpression') {
      statement.init = new syntax.ExpressionStatement(statement.init);
    }
    place.push(statement.init);
  }
  
  delete statement.init;
  delete statement.update;
  
  normalizeWhile(statement, place);
}
