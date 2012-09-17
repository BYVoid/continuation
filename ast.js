var fs = require('fs');
var util = require('util');
var esprima = require('esprima');

var filename = process.argv[2];

fs.readFile(filename, 'utf-8', function(err, text) {
  var options = {
    //loc: true,
    comment: true,
  };
  var ast = esprima.parse(text, options);
  console.log(util.inspect(ast, false, null, true));
});
