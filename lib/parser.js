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

function constructor(node) {
  switch (node.type) {
    case 'BlockStatement':
    return new syntax.BlockStatement(node.body);
    case 'BreakStatement':
    return new syntax.BreakStatement(node.label);
    case 'ContinueStatement':
    return new syntax.ContinueStatement(node.label);
    case 'EmptyStatement':
    return new syntax.EmptyStatement();
    case 'ExpressionStatement':
    return new syntax.ExpressionStatement(node.expression);
    case 'ForStatement':
    return new syntax.ForStatement(
      node.init,
      node.test,
      node.update,
      node.body
    );
    case 'FunctionDeclaration':
    return new syntax.FunctionDeclaration(node.id, node.params, node.body);
    case 'IfStatement':
    return new syntax.IfStatement(node.test, node.consequent, node.alternate);
    case 'ReturnStatement':
    return new syntax.ReturnStatement(node.argument);
    case 'SwitchStatement':
    return new syntax.SwitchStatement(node.discriminant, node.cases);
    case 'VariableDeclaration':
    return new syntax.VariableDeclaration(node.declarations, node.kind);
    case 'WhileStatement':
    return new syntax.WhileStatement(node.test, node.body);

    case 'AssignmentExpression':
    return new syntax.AssignmentExpression(
      node.operator,
      node.left,
      node.right
    );
    case 'BinaryExpression':
    return new syntax.BinaryExpression(
      node.operator,
      node.left,
      node.right
    );
    case 'CallExpression':
    return new syntax.CallExpression(node.callee, node.arguments);
    case 'FunctionExpression':
    return new syntax.FunctionExpression(node.id, node.params, node.body);
    case 'Literal':
    return new syntax.Literal(node.value);
    case 'Identifier':
    return new syntax.Identifier(node.name);
    case 'MemberExpression':
    return new syntax.MemberExpression(node.object, node.property, node.computed);
    case 'UpdateExpression':
    return new syntax.UpdateExpression(node.operator, node.argument, node.prefix);
    case 'VariableDeclaration':
    return new syntax.VariableDeclaration(node.declarations, node.kind);
    case 'VariableDeclarator':
    return new syntax.VariableDeclarator(node.id, node.init);
    
    default:
    return node;
  }
}
