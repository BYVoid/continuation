var traverse = module.exports = function(statement, func) {
  switch (statement.type) {
    case 'BlockStatement':
    case 'Program':
      for (var i = 0; i < statement.body.length; i++) {
        statement.body[i] = traverse(statement.body[i], func);
      }
      break;
    case 'ExpressionStatement':
      statement.expression = traverseExpression(statement.expression, func);
      break;
    case 'IfStatement':
      statement.consequent = traverse(statement.consequent, func);
      if (statement.alternate !== null) {
        statement.alternate = traverse(statement.alternate, func);
      }
      break;
    case 'WhileStatement':
      statement.body = traverse(statement.body, func);
      break;
    case 'ForStatement':
      statement.init = traverseExpression(statement.init, func);
      statement.test = traverseExpression(statement.test, func);
      statement.update = traverseExpression(statement.update, func);
      statement.body = traverse(statement.body, func);
      break;
    case 'SwitchStatement':
      if (statement.cases) {
        for (var i = 0; i < statement.cases.length; i++) {
          statement.cases[i] = traverse(statement.cases[i], func);
        }
      }
      break;
    case 'SwitchCase':
      for (var i = 0; i < statement.consequent.length; i++) {
        statement.consequent[i] = traverse(statement.consequent[i], func);
      }
      break;
    case 'VariableDeclaration':
      for (var i = 0; i < statement.declarations.length; i++) {
        statement.declarations[i] = traverse(statement.declarations[i], func);
      }
      break;
    case 'VariableDeclarator':
      statement.init = traverseExpression(statement.init, func);
      break;
    case 'FunctionDeclaration':
      statement.body = traverse(statement.body, func);
      break;
    //TODO
    case 'ReturnStatement':
  }
  statement = func(statement);
  return statement;
};

var traverseExpression = function(expression, func) {
  if (expression === null) {
    return null;
  }
  
  switch (expression.type) {
    case 'AssignmentExpression':
      expression.left = traverseExpression(expression.left, func);
      expression.right = traverseExpression(expression.right, func);
      break;
    case 'CallExpression':
      expression.callee = traverseExpression(expression.callee, func);
      expression.arguments.forEach(function (argument, i) {
        expression.arguments[i] = traverseExpression(argument, func);
      });
      break;
    case 'FunctionExpression':
      expression.body = traverse(expression.body, func);
      break;
  }
  
  expression = func(expression);
  return expression;
};

traverse.getIdentifiersInBlock = function(blockStatement) {
  var identifiersMap = {};
  var addIdentifier = function (id) {
    if (id.type === 'Identifier') {
      identifiersMap[id.name] = true;
    }
  };
  
  traverse(blockStatement, function (node) {
    switch (node.type) {
      case 'AssignmentExpression':
      case 'BinaryExpression':
        addIdentifier(node.left);
        addIdentifier(node.right);
        break;
      case 'CallExpression':
        addIdentifier(node.callee);
        break;
      case 'ExpressionStatement':
        addIdentifier(node.expression);
        break;
      case 'FunctionDeclaration':
      case 'FunctionExpression':
        addIdentifier(node.id);
        break;
      case 'Identifier':
        addIdentifier(node);
        break;
      case 'MemberExpression':
        addIdentifier(node.object);
        addIdentifier(node.property);
        break;
      case 'VariableDeclarator':
        addIdentifier(node.id);
        break;
      default:
    }
    return node;
  });
  
  return Object.keys(identifiersMap);
};

traverse.replaceIdentifierInBlock = function(blockStatement, oldId, newId) {
  //TODO to be implemented
};
