# Continuation.js

Continuation.js is a compiler for [Continuation-Passing Style](http://en.wikipedia.org/wiki/Continuation-passing_style) transformation, which simplifies asynchronous JavaScript programming.
It translates slightly flavored JavaScript syntax into standard JavaScript, so it can be also called a "translator".
Continuation.js introduces a virtual function ``cont``, which allow you to write continuation-passing style code (or asynchronous callback style code) far easier.
`cont` is not a actual function, but a mark with the same syntax to function calls in JavaScript.
By using Continuation.js you can write asynchronous control flows like flat threaded code, and it compiles it into continuation-passing style code.

Typically, writing with asynchronous control flow is a pain, because you will easily write nested callbacks like below:

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

This kind of coding style is called "callback hells" or "callback pyramids".
While using Continuation.js, you directly write:

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

The code above is flatted by using the virtual function ``cont``.
Control flow must "wait" for the return of asynchronous function call ``fs.readFile``.
Parameters in the argument list of ``cont`` will be set after it returns.
"Return" here is a little confusing because in an asynchronous function "return" means callback function called, not "return" in the literal sense.
An asynchronous function usually returns immediately (by encountering ``return`` statement or the end of the function scope) while the callback function could be called later.
You can be understood as all the statements after ``cont`` until the end of the function are the callback function of the asynchronous function call.
The code feels like threaded code, but it is still asynchronous while executing.

Even more simply, the asynchronous error can be held with JavaScript ``try...catch`` syntax and another virtual function call ``obtain`` provided by Continuation.js.
``obtain(a)`` is equivalent to ``cont(err, a)``, and ``err`` would be thrown if it is not ``undefined``.

```javascript
function textProcessing(ret) {
  try {
    fs.readFile('somefile.txt', 'utf-8', obtain(contents));
    contents = contents.toUpperCase();
    fs.readFile('somefile2.txt', 'utf-8', obtain(contents2));
    contents += contents2;
    fs.writeFile('somefile_concat_uppercase.txt', contents, obtain());
    ret(null, contents);
  } catch(err) {
    ret(err);
  }
}
try {
  textProcessing(obtain(contents));
} catch(err) {
  console.error(err);
}
```

## Features

* A JIT (Just-in-time compilation) and AOT (Ahead-of-time) compiler
* Strictly no runtime dependence
* No additional non-native JavaScript syntax and very few reserved keywords (only ``cont``, ``obtain`` and ``parallel``)
* Flexible coding style and readable compiled code
* Compatible with [CoffeeScript](http://coffeescript.org/) and [LiveScript](http://livescript.net/) (and other compile-to-js language)
* Supports both Node.js and browser-side JavaScript
* Supports execution in parallel and lightweight thread

## Documentation

### cont

``cont`` is a mark of asynchronous calls.
It must be used in the place of callback function parameter of a function call.
The parameters in ``cont`` will be set to the values of arguments of the callback function.
If parameter of ``cont`` is a variable (not an expression), it will be defined automatically before the function call.

Example:

```javascript
setTimeout(cont(), 1000);

fs.lstat('/path/file', cont(err, stats));

var obj;
fs.readdir('/path', cont(err, obj.files));
```

Compiled code:

```javascript
var err, stats, obj;
setTimeout(function () {
  fs.lstat('/path', function () {
    err = arguments[0];
    stats = arguments[1];
    fs.readdir('/path', function () {
      err = arguments[0];
      obj.files = arguments[1];
    });
  });
}, 1000);
```

### obtain

``obtain`` is a syntax sugar of ``cont`` and ``throw``.
You can use ``try`` to catch asynchronous errors with ``obtain``.
One assumption is that the error object is the first parameter of the callback function (this is a convention of Node.js API).

Example:

```javascript
function f1() {
  fs.readdir('/path', obtain(files));
}

function f2() {
  fs.readdir('/path', cont(err, files));
  if (err)
    throw err;
}
```

Compiled code:

```javascript
function f1() {
  var _$err, files;
  fs.readdir('/path', function () {
    _$err = arguments[0];
    files = arguments[1];
    if (_$err)
      throw _$err;
  });
}
function f2() {
  var err, files;
  fs.readdir('/path', function () {
    err = arguments[0];
    files = arguments[1];
    if (err) {
      throw err;
    }
  });
}
```

### parallel

``parallel`` allows you to execute asynchronous functions "in parallel".
``parallel`` is also a virtual function and its parameters should be all function calls with ``cont`` or ``obtain``.
All function calls in ``parallel`` will be executed in parallel and control flow continues executing the next statement after all the parallel function calls "return" (precisely speaking callback functions called).

Note that both Node.js and browser execute JavaScript code in single thread, so this is not a multithreaded implementation.
The function calls feel like entrances of threads so they can be called "lightweight threads".
Only I/O and computing are executed in parallel while computing are actually executed in sequence.
That is, when one "thread" is "blocked" by I/O, the other one runs.
The "threads" can automatically utilize the gaps of I/O and computing.
So you should let functions that both have I/O and computing run in parallel, rather than all functions with heavy computing and little I/O.

Example:

```javascript
var contents = {};
parallel(
  fs.readFile('/path1', obtain(contents.file1)),
  fs.readFile('/path2', obtain(contents.file2)),
  fs.readFile('/path3', obtain(contents.file3))
);
console.log(contents);
```

### Explicit mode

Modules can be written in Continuation.js and they will be recursively compiled automatically when using ``require``.
Add ``'use continuation'`` into your source file, and use ``continuation script.js --explicit`` to run it and only files contains ``'use continuation'`` will be compiled.
This option can reduce loading time if many modules are recursively required.

### Compilation cache

By using ``contination script.js --cache [cacheDir]``, all modules compiled by Contination.js will be cached into ``cacheDir``.
If the timestamp of your source file is newer than the cached version, it will be compiled again.
This option rely on the system clock and it can also reduce loading time.
It is recommended to use ``--explicit`` and ``--cache`` together.

By default ``cacheDir`` is ``/tmp/continuation``.

### Use Continuation.js in CoffeeScript (and other compile-to-js language)

Continuation.js is compatible with most kinds of compile-to-js language because it introduces no non-primitive syntax.
The only 3 keywords ``cont``, ``obtain`` and ``parallel`` are all virtual functions so you can use function call directly in your language.

Example (CoffeeScript):

```coffeescript
dns = require('dns')
domains = ['www.google.com', 'nodejs.org', 'www.byvoid.com']
for domain in domains
  dns.resolve domain, obtain(addresses)
  console.log addresses
```

Until now [CoffeeScript](http://coffeescript.org/) and [LiveScript](http://livescript.net/) are supported by default.

### Use Continuation.js programmatically

You are able to use Continuation.js programmatically.
Continuation.js module has one interface function ``compile(code)``.
``code`` must be a string.

Example:

```javascript
var continuation = require('continuation');

function fibonacci() {
  var a = 0, current = 1;
  while (true) {
    var b = a;
    a = current;
    current = a + b;
    setTimeout(cont(), 1000);
    console.log(current);
  }
};

var code = fibonacci.toString();
var compiledCode = continuation.compile(code);
console.log(compiledCode);
eval(compiledCode);
fibonacci();
```

You can run the code above using ``node`` command.
That means you don't have to install Continuation.js in global environment.
The code above converts a function into a string, and then it is compiled by Continuation.js.
After that you can run it via ``eval`` function.

## Installation

Install Continuation.js with [npm](https://npmjs.org/package/continuation):

    npm install -g continuation

## Usage

    Usage: continuation [options] <file.js/file.coffee/file.ls> [arguments]

    Options:

      -h, --help               output usage information
      -V, --version            output the version number
      -p, --print              compile script file and print it
      -o, --output <filename>  compile script file and save as <filename>
      -e, --explicit           compile only if "use continuation" is explicitly declared
      -c, --cache [directory]  run and cache compiled sources to [directory], by default [directory] is /tmp/continuation
      -v, --verbose            print verbosal information to stderr

Run code written with Continuation.js (i.e. script.js):

    contination script.js

Print compiled code on console:

    contination script.js -p

Compile code and save as another file:

    contination script.js -o compiled.js

Run code in "explicit mode" (only compile sources with ``'use continuation'``. see documentation):

    contination script.js -e

Cache compiled code (including recursively required modules) to accelerate loading (see documentation):

    contination script.js -c

## Examples

### Loops and sleep

Calculating Fibonacci sequence and printing one number by every one second:

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

### Run asynchronous functions in sequence

Read 5 files in sequence:

```javascript
var fs = require('fs');

for (var i = 0; i < 4; i++) {
  fs.readFile('text' + i + '.js', 'utf-8', obtain(text));
  console.log(text);
}

console.log('Done');
```

### Run asynchronous functions in parallel

Do things (with heave I/O) in parallel:

```javascript
var fs = require('fs');
var dns = require('dns');
var http = require('http');

var complexWork = function (next) {
  setTimeout(cont(), 500);
  http.get('http://www.byvoid.com', cont(res));
  next(null, res.headers);
};

parallel(
  fs.readdir('/', obtain(files)),
  dns.resolve('npmjs.org', obtain(addresses)),
  complexWork(obtain(result))
);

console.log(files, addresses, result);
```

### Recursions

Calculating disk usage:

```javascript
var fs = require('fs');

function calcDirSize(path, callback) {
  var dirSize = 0, dirBlockSize = 0;
  fs.readdir(path, obtain(files));
  for (var i = 0; i < files.length; i++) {
    var filename = path + '/' + files[i];
    fs.lstat(filename, obtain(stats));
    if (stats.isDirectory()) {
      calcDirSize(filename, obtain(subDirSize, subDirBlockSize));
      dirSize += subDirSize;
      dirBlockSize += subDirBlockSize;
    } else {
      dirSize += stats.size;
      dirBlockSize += 512 * stats.blocks;
    }
  }
  callback(null, dirSize, dirBlockSize);
}

var path = process.argv[2];
if (!path) path = '.';

calcDirSize(path, obtain(totalSize, totalBlockSize));

console.log('Size:', Math.round(totalSize / 1024), 'KB');
console.log('Actual Size on Disk:', Math.round(totalBlockSize / 1024), 'KB');
```

More examples are available in 'examples' directory and 'test' directory.
