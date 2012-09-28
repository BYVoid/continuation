var util = require('util');
var assert = require('assert');

var traverse = module.exports = function (node, func) {
  if (node === null || typeof(node) === 'string' || typeof(node) === 'number'
    || typeof(node) === 'boolean' || typeof(node) === 'undefined') {
    return node;
  }
  Object.keys(node).forEach(function (key) {
    if (key === 'type' || key === 'name' || key === 'value' || key === 'label') {
      //Optimization for leaf node
      return;
    }
    var prop = node[key];
    if (util.isArray(prop)) {
      prop.forEach(function (subNode, i) {
        prop[i] = traverse(subNode, func);
      });
    } else {
      node[key] = traverse(prop, func);
    }
  });
  assert(node.type);
  return func(node);
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
