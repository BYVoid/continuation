var util = require('util');
var esprima = require('esprima');
var syntax = require('./syntax');
var traverse = require('./traverse');

exports.parse = function parse(code) {
  var options = {
    //loc: true,
    comment: true,
  };
  var ast = esprima.parse(code, options);
  ast = new syntax.Program(ast.body, ast.comments);
  
  traverse(ast, constructor);
  //console.log(util.inspect(ast, false, null, true));
  return ast;
}

function constructor(statement) {
  switch (statement.type) {
    case 'BlockStatement':
    return new syntax.BlockStatement(statement.body);
    case 'BreakStatement':
    return new syntax.BreakStatement(statement.label);
    case 'ContinueStatement':
    return new syntax.ContinueStatement(statement.label);
    case 'EmptyStatement':
    return new syntax.EmptyStatement();
    case 'ExpressionStatement':
    return new syntax.ExpressionStatement(expressionContructor(statement.expression));
    case 'ForStatement':
    return new syntax.ForStatement(
      expressionContructor(statement.init),
      expressionContructor(statement.test),
      expressionContructor(statement.update),
      statement.body
    );
    case 'FunctionDeclaration':
    return new syntax.FunctionDeclaration(statement.id, statement.params, statement.body);
    case 'IfStatement':
    return new syntax.IfStatement(statement.test, statement.consequent, statement.alternate);
    case 'ReturnStatement':
    return new syntax.ReturnStatement(statement.argument);
    case 'SwitchStatement':
    return new syntax.SwitchStatement(statement.discriminant, statement.cases);
    case 'VariableDeclaration':
    return new syntax.VariableDeclaration(declarationsConstructor(statement.declarations), statement.kind);
    case 'WhileStatement':
    return new syntax.WhileStatement(statement.test, statement.body);
    default:
    return statement;
  }
}

function expressionContructor(expression) {
  if (expression === null) {
    return null;
  }
  
  switch (expression.type) {
    case 'AssignmentExpression':
    return new syntax.AssignmentExpression(
      expression.operator,
      expressionContructor(expression.left),
      expressionContructor(expression.right)
    );
    case 'BinaryExpression':
    return new syntax.BinaryExpression(
      expression.operator,
      expressionContructor(expression.left),
      expressionContructor(expression.right)
    );
    case 'CallExpression':
    return new syntax.CallExpression(expression.callee, expression.arguments);
    case 'FunctionExpression':
    return new syntax.FunctionExpression(expression.id, expression.params, expression.body);
    case 'Literal':
    return new syntax.Literal(expression.value);
    case 'Identifier':
    return new syntax.Identifier(expression.name);
    case 'MemberExpression':
    return new syntax.MemberExpression(expression.object, expression.property, expression.computed);
    case 'UpdateExpression':
    return new syntax.UpdateExpression(expression.operator, expression.argument, expression.prefix);
    case 'VariableDeclaration':
    return new syntax.VariableDeclaration(declarationsConstructor(expression.declarations), expression.kind);
    default:
    return expression;
  }
}

function declarationsConstructor(declarations) {
  declarations.forEach(function (declaration, i) {
    declarations[i] = new syntax.VariableDeclarator(
      expressionContructor(declaration.id),
      expressionContructor(declaration.init)
    );
  });
  return declarations;
}
