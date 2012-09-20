var assert = require('assert');
var fs = require('fs');
var path = require('path');
var continuation = require('../continuation');

var files = [
  'if.js',
  'ifvar.js',
  'loop.js',
  'seq1.js',
  'seq2.js',
  'seq3.js',
  'switch.js',
  'switchbreak.js',
  'whilebreak.js',
];

var test = function(filename, done) {
  fs.readFile('test/cases/' + filename, 'utf-8', function (err, code) {
    if (err) done(err);
    code = continuation.transform(code);
    fs.readFile('test/results/' + filename, 'utf-8', function(err, result) {
      if (err) done(err);
      assert.equal(code, result);
      done();
    });
  });
}

describe('Transformation', function () {
  describe('Test', function () {
    files.forEach(function (filename) {
      it(filename, function(done){
        test(filename, done);
      });
    });
  });
});
