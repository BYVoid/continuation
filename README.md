# Continuation.js

Continuation.js is a compiler for asynchronous [Continuation-Passing Style](http://en.wikipedia.org/wiki/Continuation-passing_style) transformation, which simplifies asynchronous programming.

Typically writing with asynchronous control flow is a pain because you will easily write nested callbacks like below:

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
```

While using Continuation.js, you write:

```javascript
function textProcessing(callback) {
  fs.readFile('somefile.txt', 'utf-8', continuation(err, contents));
  if (err) return callback(err);
  contents = contents.toUpperCase();
  fs.readFile('somefile2.txt', 'utf-8', continuation(err, contents2));
  if (err) return callback(err);
  contents += contents2;
  fs.writeFile('somefile_concat_uppercase.txt', contents, continuation(err));
  if (err) return callback(err);
  callback(null, contents);
}
```

Or even simpler:

```javascript
function textProcessing(callback) {
  try {
    fs.readFile('somefile.txt', 'utf-8', defer(contents));
    contents = contents.toUpperCase();
    fs.readFile('somefile2.txt', 'utf-8', defer(contents2));
    contents += contents2;
    fs.writeFile('somefile_concat_uppercase.txt', contents, defer());
    callback(null, contents);
  } catch(err) {
    callback(err);
  }
}
```

## Features

* A JIT (Just-in-time compilation) and AOT (Ahead-of-time) compiler
* No runtime dependences
* No additional non-native JavaScript syntax
* Flexible coding style
* Readable and debuggable compiled code
* Compatible with CoffeeScript
* Supports both Node.js and browser JavaScript
* Parallel execution supported

## Installation

    npm install -g continuation

## Usage

  continuation [options] <file.js> [arguments]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -c, --compile            only compile script file and print it
    -o, --output <filename>  compile script file and save as <filename>, implies --compile

## Documentation

Continuation.js is still under development. Most functionalities are not fully implemented or tested.

To be written...

## Examples

Calcuating Fibonacci sequence and printing one number by every one second:

```javascript
var fib = function () {
    var a = 0, current = 1;
    while (true) {
        var b = a;
        a = current;
        current = a + b;
        setTimeout(continuation(), 1000);
        console.log(current);
    }
};
fib();
```

## License

BSD License

    Copyright 2012 (c) Carbo KUO

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.
