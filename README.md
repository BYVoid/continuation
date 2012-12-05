# Continuation.js

Continuation.js is a compiler for asynchronous [Continuation-Passing Style](http://en.wikipedia.org/wiki/Continuation-passing_style) transformation, which simplifies asynchronous JavaScript programming.

Typically, writing with asynchronous control flow is a pain because you will easily write nested callbacks like below:

```javascript
function textProcessing(callback) {
  fs.readFile('somefile.txt', 'utf-8', function (err, contents) {
    if (err) return callback(err);
    //process contents
    contents = contents.toUpperCase();
    fs.readFile('somefile2.txt', 'utf-8', function (err, contents2) {
      if (err) return callback(err);
      contents += contents2;
      fs.writeFile('somefile_concat_uppercase.txt', contents, function (err) {
        if (err) return callback(err);
        callback(null, contents);
      });
    });
  });
}
textProcessing(function (err, contents) {
  if (err)
    console.error(err);
});
```

This kind of coding style is called 'callback hells' or 'callback pyramids'. While using Continuation.js, you directly write:

```javascript
function textProcessing(ret) {
  fs.readFile('somefile.txt', 'utf-8', cont(err, contents));
  if (err) return ret(err);
  contents = contents.toUpperCase();
  fs.readFile('somefile2.txt', 'utf-8', cont(err, contents2));
  if (err) return ret(err);
  contents += contents2;
  fs.writeFile('somefile_concat_uppercase.txt', contents, cont(err));
  if (err) return ret(err);
  ret(null, contents);
}
textProcessing(cont(err, contents));
if (err)
  console.error(err);
```

Or even simpler:

```javascript
function textProcessing(ret) {
  fs.readFile('somefile.txt', 'utf-8', obtain(contents));
  contents = contents.toUpperCase();
  fs.readFile('somefile2.txt', 'utf-8', obtain(contents2));
  contents += contents2;
  fs.writeFile('somefile_concat_uppercase.txt', contents, obtain());
  ret(null, contents);
}
try {
  textProcessing(obtain(contents));
} catch(err) {
  console.error(err);
}
```

## Features

* A JIT (Just-in-time compilation) and AOT (Ahead-of-time) compiler
* No runtime dependences
* No additional non-native JavaScript syntax
* Flexible coding style
* Readable and debuggable compiled code
* Compatible with [CoffeeScript](http://coffeescript.org/) and [LiveScript](http://livescript.net/)
* Supports both Node.js and browser-side JavaScript
* Parallel execution supported

## Installation

Install Continuation.js with [NPM](https://npmjs.org/package/continuation):

    npm install -g continuation

## Usage

    Usage: continuation [options] <file.js/file.coffee> [arguments]

    Options:

      -h, --help               output usage information
      -V, --version            output the version number
      -p, --print              compile script file and print it
      -o, --output <filename>  compile script file and save as <filename>
      -e, --explicit           compile only if "use continuation" is explicitly declared
      -c, --cache [directory]  run and cache compiled sources to [directory], by default [directory] is /tmp/continuation
      -v, --verbose            print verbosal information to stderr

## Documentation

Continuation.js is still under development. Most functionalities are not fully implemented or tested.

More details are to be written.

## Examples

Calcuating Fibonacci sequence and printing one number by every one second:

```javascript
var fib = function () {
  var a = 0, current = 1;
  while (true) {
    var b = a;
    a = current;
    current = a + b;
    setTimeout(cont(), 1000);
    console.log(current);
  }
};
fib();
```

Read 5 files in sequence:

```javascript
var fs = require('fs');

for (var i = 0; i < 4; i++) {
  fs.readFile('text' + i + '.js', 'utf-8', obtain(text));
  console.log(text);
}

console.log('Done');
```

More examples are available in 'examples' directory and 'test' directory.
