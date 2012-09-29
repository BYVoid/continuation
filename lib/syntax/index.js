var syntax = module.exports;

syntax.AssignmentExpression = require('./AssignmentExpression');
syntax.BinaryExpression = require('./BinaryExpression');
syntax.BlockStatement = require('./BlockStatement');
syntax.BreakStatement = require('./BreakStatement');
syntax.CallExpression = require('./CallExpression');
syntax.CatchClause = require('./CatchClause');
syntax.ContinueStatement = require('./ContinueStatement');
syntax.EmptyStatement = require('./EmptyStatement');
syntax.ExpressionStatement = require('./ExpressionStatement');
syntax.ForStatement = require('./ForStatement');
syntax.FunctionDeclaration = require('./FunctionDeclaration');
syntax.FunctionExpression = require('./FunctionExpression');
syntax.Identifier = require('./Identifier');
syntax.IfStatement = require('./IfStatement');
syntax.Literal = require('./Literal');
syntax.MemberExpression = require('./MemberExpression');
syntax.Program = require('./Program');
syntax.ReturnStatement = require('./ReturnStatement');
syntax.SequenceExpression = require('./SequenceExpression');
syntax.SwitchStatement = require('./SwitchStatement');
syntax.TryStatement = require('./TryStatement');
syntax.UpdateExpression = require('./UpdateExpression');
syntax.VariableDeclaration = require('./VariableDeclaration');
syntax.VariableDeclarator = require('./VariableDeclarator');
syntax.WhileStatement = require('./WhileStatement');

//Virtual syntax
syntax.AssignmentStatement = require('./AssignmentStatement');
syntax.CallStatement = require('./CallStatement');

syntax.factory = function (node) {
  switch (node.type) {
    case 'AssignmentExpression':
    return new syntax.AssignmentExpression(node.operator, node.left, node.right);
    case 'BinaryExpression':
    return new syntax.BinaryExpression(node.operator, node.left, node.right);
    case 'BlockStatement':
    return new syntax.BlockStatement(node.body);
    case 'BreakStatement':
    return new syntax.BreakStatement(node.label);
    case 'CallExpression':
    return new syntax.CallExpression(node.callee, node.arguments);
    case 'CatchClause':
    return new syntax.CatchClause(node.param, node.guard, node.body);
    case 'ContinueStatement':
    return new syntax.ContinueStatement(node.label);
    case 'EmptyStatement':
    return new syntax.EmptyStatement();
    case 'ExpressionStatement':
    return new syntax.ExpressionStatement(node.expression);
    case 'ForStatement':
    return new syntax.ForStatement(node.init, node.test, node.update, node.body);
    case 'FunctionDeclaration':
    return new syntax.FunctionDeclaration(node.id, node.params, node.body);
    case 'FunctionExpression':
    return new syntax.FunctionExpression(node.id, node.params, node.body);
    case 'Identifier':
    return new syntax.Identifier(node.name);
    case 'IfStatement':
    return new syntax.IfStatement(node.test, node.consequent, node.alternate);
    case 'Literal':
    return new syntax.Literal(node.value);
    case 'MemberExpression':
    return new syntax.MemberExpression(node.object, node.property, node.computed);
    case 'ReturnStatement':
    return new syntax.ReturnStatement(node.argument);
    case 'SwitchStatement':
    return new syntax.SwitchStatement(node.discriminant, node.cases);
    case 'TryStatement':
    return new syntax.TryStatement(node.block, node.handlers, node.finalizer);
    case 'UpdateExpression':
    return new syntax.UpdateExpression(node.operator, node.argument, node.prefix);
    case 'VariableDeclaration':
    return new syntax.VariableDeclaration(node.declarations, node.kind);
    case 'VariableDeclarator':
    return new syntax.VariableDeclarator(node.id, node.init);
    case 'WhileStatement':
    return new syntax.WhileStatement(node.test, node.body);
    default:
    return node;
  }
}; 
