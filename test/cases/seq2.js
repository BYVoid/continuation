var fs = require('fs');
var a = 1;
var b, c = 2;
var rs = fs.readFile('e.js', continuation(err, text));
a += 1;
console.log(a);
