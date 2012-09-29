var fs = require('fs');
var a = 1;
fs.readFile('continuation.js', function () {
    var err = arguments[0];
    var text = arguments[1];
    a += 1;
    console.log(a, err, text);
});