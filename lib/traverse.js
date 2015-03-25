var util = require('util');
var assert = require('assert');

var traverse = module.exports = function (node, options, func) {
  if (!func) func = options;
  function go(node) {
    if (node === null || typeof(node) === 'string' || typeof(node) === 'number' ||
        typeof(node) === 'boolean' || typeof(node) === 'undefined' ||
        util.isRegExp(node)) {
      return node;
    }
    if (options && options.stop && options.stop(node)) {
      return node;
    }
    assert(node.type);
    if (options.currentScope) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
        return func(node);
      }
    }
    Object.keys(node).forEach(function (key) {
      if (key === 'type' || key === 'name' || key === 'label') {
        //Optimization for leaf node
        return;
      }
      var prop = node[key];
      if (util.isArray(prop)) {
        var newArray = [];
        prop.forEach(function (subNode, i) {
          subNode = go(subNode);
          if (util.isArray(subNode)) {
            newArray = newArray.concat(subNode);
          } else if (subNode !== null) {
            newArray.push(subNode);
          }
        });
        node[key] = newArray;
      } else {
        if (key !== 'range' && key !== 'loc') {
          node[key] = go(prop);
        }
      }
    });
    return func(node);
  }
  go(node);
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
