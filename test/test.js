var assert = require('assert');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var continuation = require('../continuation');

var files = [
  'readfile.js',
  'fib.js',
  'if.js',
  'ifvar.js',
  'loop.js',
  'switch.js',
  'switchbreak.js',
  'whilebreak.js',
  'continue.js',
  'factor.js',
  'pi.js',
  'diskusage.js',
  'try_body.js',
  'try_catch.js',
  'try_both.js',
  'try_sync.js',
  'try_nested_function.js',
  'list.js',
  'defer.js',
  'for.js',
  'forin.js',
  'try_if.js',
  'parallel.js',
  'parallel_exception.js',
  'nested_block.js',
  'multiple_parallel.js',
];

var compileByApi = function(filename, done) {
  fs.readFile('test/cases/' + filename, 'utf-8', function (err, code) {
    if (err) return done(err);
    code = continuation.compile(code);
    fs.readFile('test/results/' + filename, 'utf-8', function(err, result) {
      if (err) return done(err);
      assert.equal(code, result);
      done();
    });
  });
}

var compileByCli = function(filename, done) {
  var bin = 'bin/continuation'
  var cmd = bin + ' test/cases/' + filename + ' -p'
  child_process.exec(cmd, function (err, stdout, stderr) {
    if (err) return done(err);
    fs.readFile('test/results/' + filename, 'utf-8', function(err, result) {
      if (err) done(err);
      assert.equal(stdout, result + '\n');
      done();
    });
  });
}

describe('Transformation', function () {
  describe('Compile by api', function () {
    files.forEach(function (filename) {
      it(filename, function(done){
        compileByApi(filename, done);
      });
    });
  });
  describe('Compile by command line', function () {
    files.forEach(function (filename) {
      it(filename, function(done){
        compileByCli(filename, done);
      });
    });
  });
});
