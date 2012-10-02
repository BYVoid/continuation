var fs = require('fs');
var a = 1;
fs.readFile('continuation.js', cont(err, text));
a += 1;
console.log(a, err, text);
