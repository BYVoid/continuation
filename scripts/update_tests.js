'use continuation'

var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var continuation = require('../continuation');

var notEval = ['diskusage.js'];

fs.readdir('test/cases', obtain(files));
for (var i = 0; i < files.length; i++) {
  var filename = files[i];
  if (path.extname(filename) === '.js') {
    console.log(filename);
    fs.readFile('test/cases/' + filename, 'utf-8', obtain(code));
    code = continuation.compile(code);
    var resultFile = 'test/results/' + filename;
    fs.writeFile(resultFile, code, obtain());
    if (notEval.indexOf(filename) == -1) {
      child_process.exec('node ' + resultFile, obtain(stdout));
      fs.writeFile('test/outputs/' + path.basename(filename, '.js') + '.txt', stdout, obtain());
    }
  }
}
