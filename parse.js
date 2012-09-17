var fs = require('fs');
var util = require('util');
var esprima = require('esprima');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

var syntax = require('./syntax');
var Literal = syntax.Literal;
var Identifier = syntax.Identifier;
var MemberExpression = syntax.MemberExpression;
var Assignment = syntax.Assignment;
var BlockStatement = syntax.BlockStatement;
var FunctionDeclaration = syntax.FunctionDeclaration;
var ExpressionStatement = syntax.ExpressionStatement;
var CallExpression = syntax.CallExpression;

var continuationIdentifier = 'continuation';

var filename = process.argv[2];

fs.readFile(filename, 'utf-8', function(err, text) {
  var options = {
    //loc: true,
    comment: true,
  };
  var ast = esprima.parse(text, options);
  transform(ast);
});

function transform(ast) {
  //console.log(util.inspect(ast, false, null, true));
  transformBlock(ast);
  console.log(escodegen.generate(ast));
}

function transformBlock(block) {
  var newBody = [];
  var place = newBody;
  var async = false;
  
  for (var i = 0; i < block.body.length; i++) {
    var statement = block.body[i];
    var newPlace = place;
    if (statement.type === 'ExpressionStatement' && statement.expression.type === 'CallExpression') {
      newPlace = transformCall(statement, place);
    } else if (statement.type === 'ExpressionStatement' && statement.expression.type === 'AssignmentExpression') {
      newPlace = transformAssignment(statement, place);
    } else if (statement.type === 'VariableDeclaration') {
      newPlace = transformDeclarations(statement, place);
    } else if (statement.type === 'IfStatement') {
      newPlace = transformIf(statement, place);
    } else if (statement.type === 'WhileStatement') {
      newPlace = transformWhile(statement, place);
    } else if (statement.type === 'ForStatement') {
      newPlace = transformFor(statement, place);
    } else if (statement.type === 'SwitchStatement') {
      newPlace = transformSwitch(statement, place);
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
      callbackBlock.push(new Assignment(arg, new MemberExpression(new Identifier('arguments'), new Literal(index))));
    });
    
    //Replace continuation with a callback function
    args[contPos] = {
      type: 'FunctionExpression',
      id: null,
      params: [],
      body: {
        type: 'BlockStatement',
        body: callbackBlock,
      }
    };
    return callbackBlock;
  }
}

function transformCall(statement, place) {
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
  } else {
    place.push(statement);
  }
  return place;
}

function transformDeclarations(statement, place) {
  statement.declarations.forEach(function (declaration) {
    var newPlace;
    if (declaration.init !== null && declaration.init.type === 'CallExpression') {
      newPlace = continuationToCallback(declaration.init.arguments);
    }
    var newStatement = {
      type: statement.type,
      declarations: [declaration],
      kind: statement.kind,
    };
    place.push(newStatement);
    if (newPlace) {
      place = newPlace;
    }
  });
  return place;
}

function transformIf(statement, place) {
  if (statement.consequent.type !== 'BlockStatement') {
    statement.consequent = {
      type: 'BlockStatement',
      body: [statement.consequent],
    };
  }
  var consequentRes = transformBlock(statement.consequent);
  
  if (statement.alternate === null) {
    statement.alternate = {
      type: 'BlockStatement',
      body: [],
    };
  } else if (statement.alternate.type !== 'BlockStatement') {
    statement.alternate = {
      type: 'BlockStatement',
      body: [statement.alternate],
    };
  }
  var alternateRes = transformBlock(statement.alternate);
  
  if (consequentRes.async || alternateRes.async) {
    var nextStatement = {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {type: 'Identifier', name: continuationIdentifier},
        arguments: [],
      },
    };
    consequentRes.place.push(nextStatement);
    alternateRes.place.push(nextStatement);
    
    var nextPlace = [];
    place.push(makeCPS([statement], nextPlace));
    return nextPlace;
  }
  
  place.push(statement);
  return place;
}

var loopCount = 0;
function getLoopFunctionName() {
  var name = 'loop_' + loopCount;
  loopCount ++;
  return name;
}

function transformWhile(statement, place) {
  if (statement.body.type !== 'BlockStatement') {
    statement.body = {
      type: 'BlockStatement',
      body: [statement.body],
    };
  }
  var blockRes = transformBlock(statement.body);

  if (blockRes.async) {
    var loopFunctionName = getLoopFunctionName();
    var nextStatement = {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {type: 'Identifier', name: loopFunctionName},
        arguments: [{type: 'Identifier', name: continuationIdentifier}],
      },
    };
    blockRes.place.push(nextStatement);
    
    var body = new BlockStatement([{
      type: 'IfStatement',
      test: statement.test,
      consequent: statement.body,
      alternate: new BlockStatement([
        new ExpressionStatement(
          new CallExpression(
            new Identifier(continuationIdentifier),
            []
          )
        )
      ]),
    }]);
    
    place.push(new FunctionDeclaration(
      new Identifier(loopFunctionName),
      [new Identifier(continuationIdentifier)],
      body
    ));
    
    var nextPlace = [];
    place.push({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {type: 'Identifier', name:loopFunctionName},
        arguments: [{
          type: 'FunctionExpression',
          id: null,
          params: [],
          body: {
            type: 'BlockStatement',
            body: nextPlace,
          },
        }],
      },
    });
    return nextPlace;
  }
  
  place.push(statement);
  return place;
}

function transformFor(statement, place) {
  statement.type = 'WhileStatement';
  if (statement.body.type !== 'BlockStatement') {
    statement.body = {
      type: 'BlockStatement',
      body: [statement.body],
    };
  }
  statement.body.body.push({
    type: 'ExpressionStatement',
    expression:statement.update,
  });
  place.push(statement.init);
  place = transformWhile(statement, place);
  return place;
};

function makeCallbackFunction(name, body) {
  return {
    type: 'FunctionDeclaration',
    id: {type: 'Identifier', name: name},
    params: [{type: 'Identifier', name: continuationIdentifier}],
    body: {
      type: 'BlockStatement',
      body: body,
    },
  };
}

function makeFunctionCall(name, args, transformed) {
  var statement = {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {type: 'Identifier', name: name},
      arguments: args,
    },
  };
  if (transformed) {
    statement.transformed = transformed;
  }
  return statement;
}

function makeCPS(innerPlace, nextPlace) {
  var statement = {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'FunctionExpression',
        id: null,
        params: [{type: 'Identifier', name: continuationIdentifier}],
        body: {
          type: 'BlockStatement',
          body: innerPlace,
        },
      },
      arguments: [{
        type: 'FunctionExpression',
        id: null,
        params: [],
        body: {
          type: 'BlockStatement',
          body: nextPlace,
        },
      }],
    },
  };
  return statement;
}

function makeReturnStatement(expression) {
  return {
    type: 'ReturnStatement',
    argument: expression,
  };
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
    var callbackStatement = makeFunctionCall(name, [{type: 'Identifier', name: continuationIdentifier}]);
    sCase.consequent = [
      makeReturnStatement(callbackStatement.expression),
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
        place[i] = makeFunctionCall(continuationIdentifier, [], 'continuation');
      }
    });
    if (place.length === 0 || place[place.length - 1].transformed !== 'continuation') {
      //No break in the end, fall back into next case function
      if (nextFunc !== null) {
        place.push(makeFunctionCall(nextFunc.id.name, [{type: 'Identifier', name: continuationIdentifier}], 'continuation'));
      } else {
        place.push(makeFunctionCall(continuationIdentifier, [], 'continuation'));
      }
    }
  });
  
  //Add switch statement into inner place
  innerPlace.push(statement);
  
  var nextPlace = [];
  place.push(makeCPS(innerPlace, nextPlace));
  
  return nextPlace;
};
