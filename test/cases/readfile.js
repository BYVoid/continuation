var fs = require('fs');
var a = 1;
fs.readFile('continuation.js', continuation(err, text));
a += 1;
console.log(a, err, text);
