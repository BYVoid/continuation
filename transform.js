var assert = require('assert');
var syntax = require('./syntax');

var continuationIdentifier = 'cont';
var continuationStatement = new syntax.CallStatement(new syntax.Identifier(continuationIdentifier), []);

var transformBlock = exports.transformBlock = function (block) {
  var newBody = [];
  var place = newBody;
  var async = false;
  
  for (var i = 0; i < block.body.length; i++) {
    var statement = block.body[i];
    var newPlace = place;
    if (statement.type === 'ExpressionStatement') {
      newPlace = transformExpressionStatement(statement, place);
    } else if (statement.type === 'VariableDeclaration') {
      newPlace = transformDeclarations(statement, place);
    } else if (statement.type === 'IfStatement') {
      newPlace = transformIf(statement, place);
    } else if (statement.type === 'WhileStatement') {
      newPlace = transformWhile(statement, place);
    } else if (statement.type === 'ForStatement') {
      //Should not be here
      assert(false);
    } else if (statement.type === 'SwitchStatement') {
      newPlace = transformSwitch(statement, place);
    } else if (statement.type === 'FunctionDeclaration') {
      newPlace = transformFunctionDeclaration(statement, place);
    } else {
      place.push(statement);
    }
    if (newPlace !== place) {
      place = newPlace;
      async = true;
    }
  }
  block.body = newBody;
  return {
    async: async,
    place: place,
  };
}

function findContinuation(args) {
  //Todo check multiple continuations && defer
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg.type === 'CallExpression' && arg.callee.name === 'continuation') {
      return i;
    }
  }
  return -1;
}

function continuationToCallback(args) {
  var contPos = findContinuation(args);
  if (contPos !== -1) {
    //Function call with continuation
    var contExpr = args[contPos];
    var callbackBlock = [];
    contExpr.arguments.forEach(function (arg, index) {
      callbackBlock.push(new syntax.Assignment(arg, new syntax.MemberExpression(new syntax.Identifier('arguments'), new syntax.Literal(index))));
    });
    
    //Replace continuation with a callback function
    args[contPos] = new syntax.FunctionExpression(
      null,
      [],
      new syntax.BlockStatement(callbackBlock)
    );
    return callbackBlock;
  }
}

function transformExpressionStatement(statement, place) {
  if (statement.expression.type === 'CallExpression') {
    return transformCall(statement, place);
  }
  if (statement.expression.type === 'AssignmentExpression') {
    return transformAssignment(statement, place);
  }
  
  if (statement.expression.type === 'FunctionExpression') {
    transformBlock(statement.expression.body);
  }
  
  place.push(statement);
  return place;
}

function transformCall(statement, place) {
  if (statement.expression.callee.type === 'FunctionExpression') {
    transformBlock(statement.expression.callee.body);
  }
  
  var newPlace = continuationToCallback(statement.expression.arguments);
  place.push(statement);
  if (newPlace) {
    return newPlace;
  }
  return place;
}

function transformAssignment(statement, place) {
  if (statement.expression.right.type === 'CallExpression') {
    var newPlace = continuationToCallback(statement.expression.right.arguments);
    place.push(statement);
    if (newPlace) {
      return newPlace;
    }
  } else if (statement.expression.right.type === 'FunctionExpression') {
    transformBlock(statement.expression.right.body);
    place.push(statement);
  } else {
    place.push(statement);
  }
  return place;
}

function transformDeclarations(statement, place) {
  statement.declarations.forEach(function (declaration) {
    var newPlace = null;
    if (declaration.init !== null) {
      if (declaration.init.type === 'CallExpression') {
        newPlace = continuationToCallback(declaration.init.arguments);
      } else if (declaration.init.type === 'FunctionExpression') {
        transformBlock(declaration.init.body);
      }
    }
    place.push({
      type: 'VariableDeclaration',
      kind: statement.kind,
      declarations: [declaration],
    });
    if (newPlace) {
      place = newPlace;
    }
  });
  return place;
}

function transformIf(statement, place) {
  var consequentRes = transformBlock(statement.consequent);
  var alternateRes = transformBlock(statement.alternate);
  
  //Not transfrom if no async calls
  if (!consequentRes.async && !alternateRes.async) {
    place.push(statement);
    return place;
  }
  
  consequentRes.place.push(continuationStatement);
  alternateRes.place.push(continuationStatement);
  
  var nextPlace = [];
  place.push(makeCPS([statement], nextPlace));
  return nextPlace;
}

var loopCount = 0;
function getLoopFunctionName() {
  var name = 'loop_' + loopCount;
  loopCount ++;
  return name;
}

function traverse(block, func) {
  for (var i = 0; i < block.body.length; i++) {
    var statement = block.body[i];
    if (statement.type === 'ExpressionStatement') {
      var expression = statement.expression;
      if (expression.type === 'CallExpression') {
        if (expression.callee.type === 'FunctionExpression') {
          traverse(expression.callee.body, func);
        }
        expression.arguments.forEach(function (argument) {
          if (argument.type === 'FunctionExpression') {
            traverse(argument.body, func);
          }
        });
      }
    } else if (statement.type === 'IfStatement') {
      traverse(statement.consequent, func);
      traverse(statement.alternate, func);
    }
    statement = func(statement);
    block.body[i] = statement;
  }
}

function transformWhile(statement, place) {
  assert(statement.body.type === 'BlockStatement');
  var blockRes = transformBlock(statement.body);

  if (!blockRes.async) {
    place.push(statement);
    return place;
  }
  
  var loopFunctionName = getLoopFunctionName();
  var continuationName = loopFunctionName + '_' + continuationIdentifier;
  
  var nextStatement = new syntax.CallStatement(new syntax.Identifier(loopFunctionName), [new syntax.Identifier(continuationName)]);
  blockRes.place.push(nextStatement);
  
  var continuationStatement = new syntax.CallStatement(new syntax.Identifier(continuationName), []);
  
  var body = new syntax.BlockStatement([{
    type: 'IfStatement',
    test: statement.test,
    consequent: statement.body,
    alternate: new syntax.BlockStatement([continuationStatement]),
  }]);
  
  traverse(statement.body, function (statement) {
    if (statement.type === 'BreakStatement') {
      statement = new syntax.ReturnStatement(continuationStatement.expression);
    } 
    return statement;
  });
  
  place.push(new syntax.FunctionDeclaration(
    new syntax.Identifier(loopFunctionName),
    [new syntax.Identifier(continuationName)],
    body
  ));
  
  var nextPlace = [];
  place.push(new syntax.CallStatement(
    new syntax.Identifier(loopFunctionName),
    [new syntax.FunctionExpression(null, [], new syntax.BlockStatement(nextPlace))]
  ));
  return nextPlace;
}

function makeCallbackFunction(name, body) {
  return new syntax.FunctionDeclaration(
    new syntax.Identifier(name),
    [new syntax.Identifier(continuationIdentifier)],
    new syntax.BlockStatement(body)
  );
}

function makeCPS(innerPlace, nextPlace) {
  return new syntax.CallStatement(
    new syntax.FunctionExpression(
      null,
      [new syntax.Identifier(continuationIdentifier)],
      new syntax.BlockStatement(innerPlace)
    ),
    [new syntax.FunctionExpression(
      null,
      [],
      new syntax.BlockStatement(nextPlace)
    )]
  );
}

function transformSwitch(statement, place) {
  var innerPlace = [];
  var caseFunctions = [];
  var caseResults = [];
  var async = false;
  //Make case function form cases
  statement.cases.forEach(function (sCase, index) {
    var name = 'case_' + index;
    var func = makeCallbackFunction(name, sCase.consequent);
    var res = transformBlock(func.body);
    async = async || res.async;
    caseResults.push(res);
    caseFunctions.push(func);
    innerPlace.push(func);
  });
  
  if (!async) {
    //No need to transform
    place.push(statement);
    return place;
  }
  
  //Replace statements in cases with case function calls
  statement.cases.forEach(function (sCase, index) {
    var name = 'case_' + index;
    var continuationExpression = new syntax.CallExpression(new syntax.Identifier(name), [new syntax.Identifier(continuationIdentifier)]);
    sCase.consequent = [
      new syntax.ReturnStatement(continuationExpression),
    ];
  });
  
  caseFunctions.forEach(function (func, index) {
    var nextFunc = null;
    if (index !== caseFunctions.length - 1) {
      nextFunc = caseFunctions[index + 1];
    }
    var place = caseResults[index].place;
    place.forEach(function (statement, i) {
      //Transform break statement into continuation()
      if (statement.type === 'BreakStatement') {
        place[i] = continuationStatement;
      }
    });
    if (place.length === 0 || !isContinuationStatement(place[place.length - 1])) {
      //No break in the end, fall through into next case function
      if (nextFunc !== null) {
        place.push(new syntax.CallStatement(nextFunc.id, [new syntax.Identifier(continuationIdentifier)]));
      } else {
        place.push(continuationStatement);
      }
    }
    
    traverse(func.body, function (statement) {
      if (statement.type === 'BreakStatement') {
        statement = new syntax.ReturnStatement(continuationStatement.expression);
      } 
      return statement;
    });
  });
  
  //Add switch statement into inner place
  innerPlace.push(statement);
  
  var nextPlace = [];
  place.push(makeCPS(innerPlace, nextPlace));
  
  return nextPlace;
};

function transformFunctionDeclaration(statement, place) {
  transformBlock(statement.body);
  place.push(statement);
  return place;
}

function isContinuationStatement(statement) {
  return statement.type === 'ExpressionStatement' &&
    statement.expression.type === 'CallExpression' &&
    statement.expression.callee.name === continuationIdentifier;
}
