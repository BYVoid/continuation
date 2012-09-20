var fs = require('fs');
var a = 1;
var b;
var c = 2;
var rs = fs.readFile('e.js', function () {
        err = arguments[0];
        text = arguments[1];
        a += 1;
        console.log(a);
    });