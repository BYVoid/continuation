var fs = require('fs');
var util = require('util');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

var parser = require('./parser');
var transform = require('./transform');

var filename = process.argv[2];

fs.readFile(filename, 'utf-8', function(err, text) {
  doTransformation(text);
});

function doTransformation(code) {
  var ast = parser.parse(code);
  ast.normalize();
  //console.log(util.inspect(ast, false, null, true));
  transform.transformBlock(ast);
  console.log(escodegen.generate(ast));
}
