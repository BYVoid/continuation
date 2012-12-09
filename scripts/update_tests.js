var fs = require('fs');
var path = require('path');
var continuation = require('../continuation');

fs.readdir('test/cases', cont(err, files));
for (var i = 0; i < files.length; i++) {
  var filename = files[i];
  if (path.extname(filename) === '.js') {
    fs.readFile('test/cases/' + filename, 'utf-8', cont(err, code));
    code = continuation.compile(code);
    fs.writeFile('test/results/' + filename, code, cont(err));
    console.log(filename);
  }
}
