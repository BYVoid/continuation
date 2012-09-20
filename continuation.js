var fs = require('fs');
var util = require('util');
var esprima = require('esprima');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

var normalize = require('./normalize');
var transform = require('./transform');

var filename = process.argv[2];

fs.readFile(filename, 'utf-8', function(err, text) {
  doTransformation(text);
});

function doTransformation(code) {
  var options = {
    //loc: true,
    comment: true,
  };
  var ast = esprima.parse(code, options);
  normalize.normalizeBlock(ast);
  transform.transformBlock(ast);
  //console.log(util.inspect(ast, false, null, true));
  console.log(escodegen.generate(ast));
}
