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
    case 'ExpressionStatement':
    return new syntax.ExpressionStatement(statement.expression);
    case 'ForStatement':
    return new syntax.ForStatement(statement.init, statement.test, statement.update, statement.body);
    case 'FunctionDeclaration':
    return new syntax.FunctionDeclaration(statement.id, statement.params, statement.body);
    case 'Identifier':
    return new syntax.Literal(statement.name);
    case 'IfStatement':
    return new syntax.IfStatement(statement.test, statement.consequent, statement.alternate);
    case 'Literal':
    return new syntax.Literal(statement.value);
    case 'ReturnStatement':
    return new syntax.ReturnStatement(statement.argument);
    case 'SwitchStatement':
    return new syntax.SwitchStatement(statement.discriminant, statement.cases);
    case 'VariableDeclaration':
    return new syntax.VariableDeclaration(statement.declarations, statement.kind);
    case 'WhileStatement':
    return new syntax.WhileStatement(statement.test, statement.body);
    default:
    return statement;
  }
}

function expressionContructor(expression) {
  switch (expression.type) {
    case 'CallExpression':
    return new syntax.CallExpression(expression.callee, expression.arguments);
    case 'FunctionExpression':
    return new syntax.FunctionExpression(expression.id, expression.params, expression.body);
    case 'MemberExpression':
    return new syntax.MemberExpression(expression.object, expression.property, expression.computed);
    default:
    return expression;
  }
}
