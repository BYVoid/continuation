var syntax = module.exports;

syntax.ArrayExpression = require('./ArrayExpression');
syntax.AssignmentExpression = require('./AssignmentExpression');
syntax.BinaryExpression = require('./BinaryExpression');
syntax.BlockStatement = require('./BlockStatement');
syntax.BreakStatement = require('./BreakStatement');
syntax.CallExpression = require('./CallExpression');
syntax.CatchClause = require('./CatchClause');
syntax.ConditionalExpression = require('./ConditionalExpression');
syntax.ContinueStatement = require('./ContinueStatement');
syntax.DebuggerStatement = require('./DebuggerStatement');
syntax.EmptyStatement = require('./EmptyStatement');
syntax.ExpressionStatement = require('./ExpressionStatement');
syntax.ForInStatement = require('./ForInStatement');
syntax.ForStatement = require('./ForStatement');
syntax.FunctionDeclaration = require('./FunctionDeclaration');
syntax.FunctionExpression = require('./FunctionExpression');
syntax.Identifier = require('./Identifier');
syntax.IfStatement = require('./IfStatement');
syntax.Literal = require('./Literal');
syntax.LogicalExpression = require('./LogicalExpression');
syntax.MemberExpression = require('./MemberExpression');
syntax.NewExpression = require('./NewExpression');
syntax.ObjectExpression = require('./ObjectExpression');
syntax.Program = require('./Program');
syntax.Property = require('./Property');
syntax.ReturnStatement = require('./ReturnStatement');
syntax.SequenceExpression = require('./SequenceExpression');
syntax.SwitchStatement = require('./SwitchStatement');
syntax.ThisExpression = require('./ThisExpression');
syntax.ThrowStatement = require('./ThrowStatement');
syntax.TryStatement = require('./TryStatement');
syntax.UnaryExpression = require('./UnaryExpression');
syntax.UpdateExpression = require('./UpdateExpression');
syntax.VariableDeclaration = require('./VariableDeclaration');
syntax.VariableDeclarator = require('./VariableDeclarator');
syntax.WhileStatement = require('./WhileStatement');

syntax.factory = function (node) {
  switch (node.type) {
    case 'ArrayExpression':
    return new syntax.ArrayExpression(node.elements, node.loc, node.range);
    case 'AssignmentExpression':
    return new syntax.AssignmentExpression(node.operator, node.left, node.right, node.loc, node.range);
    case 'BinaryExpression':
    return new syntax.BinaryExpression(node.operator, node.left, node.right, node.loc, node.range);
    case 'BlockStatement':
    return new syntax.BlockStatement(node.body, node.loc, node.range);
    case 'BreakStatement':
    return new syntax.BreakStatement(node.label, node.loc, node.range);
    case 'CallExpression':
    return new syntax.CallExpression(node.callee, node.arguments, node.loc, node.range);
    case 'CatchClause':
    return new syntax.CatchClause(node.param, node.guard, node.body, node.loc, node.range);
    case 'ConditionalExpression':
    return new syntax.ConditionalExpression(node.test, node.consequent, node.alternate, node.loc, node.range);
    case 'ContinueStatement':
    return new syntax.ContinueStatement(node.label, node.loc, node.range);
    case 'DebuggerStatement':
    return new syntax.DebuggerStatement(node.loc, node.range);
    case 'EmptyStatement':
    return new syntax.EmptyStatement(node.loc, node.range);
    case 'ExpressionStatement':
    return new syntax.ExpressionStatement(node.expression, node.loc, node.range);
    case 'ForInStatement':
    return new syntax.ForInStatement(node.left, node.right, node.body, node.each, node.loc, node.range);
    case 'ForStatement':
    return new syntax.ForStatement(node.init, node.test, node.update, node.body, node.loc, node.range);
    case 'FunctionDeclaration':
    return new syntax.FunctionDeclaration(node.id, node.params, node.body, node.loc, node.range);
    case 'FunctionExpression':
    return new syntax.FunctionExpression(node.id, node.params, node.body, node.loc, node.range, true);
    case 'Identifier':
    return new syntax.Identifier(node.name, node.loc, node.range);
    case 'IfStatement':
    return new syntax.IfStatement(node.test, node.consequent, node.alternate, node.loc, node.range);
    case 'Literal':
    return new syntax.Literal(node.value, node.loc, node.range);
    case 'LogicalExpression':
    return new syntax.LogicalExpression(node.operator, node.left, node.right, node.loc, node.range);
    case 'MemberExpression':
    return new syntax.MemberExpression(node.object, node.property, node.computed, node.loc, node.range);
    case 'NewExpression':
    return new syntax.NewExpression(node.callee, node.arguments, node.loc, node.range);
    case 'ObjectExpression':
    return new syntax.ObjectExpression(node.properties, node.loc, node.range);
    case 'Property':
    return new syntax.Property(node.key, node.value, node.kind, node.loc, node.range);
    case 'ReturnStatement':
    return new syntax.ReturnStatement(node.argument, node.loc, node.range);
    case 'SwitchStatement':
    return new syntax.SwitchStatement(node.discriminant, node.cases, node.loc, node.range);
    case 'SequenceExpression':
    return new syntax.SequenceExpression(node.expressions, node.loc, node.range);
    case 'ThisExpression':
    return new syntax.ThisExpression(node.loc, node.range);
    case 'ThrowStatement':
    return new syntax.ThrowStatement(node.argument, node.loc, node.range);
    case 'TryStatement':
    return new syntax.TryStatement(node.block, node.handlers, node.finalizer, node.loc, node.range);
    case 'UnaryExpression':
    return new syntax.UnaryExpression(node.operator, node.argument, node.loc, node.range);
    case 'UpdateExpression':
    return new syntax.UpdateExpression(node.operator, node.argument, node.prefix, node.loc, node.range);
    case 'VariableDeclaration':
    return new syntax.VariableDeclaration(node.declarations, node.kind, node.loc, node.range);
    case 'VariableDeclarator':
    return new syntax.VariableDeclarator(node.id, node.init, node.loc, node.range);
    case 'WhileStatement':
    return new syntax.WhileStatement(node.test, node.body, node.loc, node.range);
    default:
    return node;
  }
}; 
