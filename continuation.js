var fs = require('fs');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

var parser = require('./parser');
var normalize = require('./normalize');
var transform = require('./transform');

var filename = process.argv[2];

fs.readFile(filename, 'utf-8', function(err, text) {
  doTransformation(text);
});

function doTransformation(code) {
  var ast = parser.parse(code);
  normalize.normalizeBlock(ast);
  transform.transformBlock(ast);
  console.log(escodegen.generate(ast));
}
