var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var commander = require('commander');
var continuation = require('../continuation');
var meta = require('../package.json');

try {var coffeescript = require('coffee-script');} catch (err) {}
try {var livescript = require('LiveScript');} catch (err) {}

var options = {
  explicit: false,
  sourceMap: true,
  verbose: false,
  cache: false,
  force: false,
  indent: '  '
};

var cacheDefaultPath = '/tmp/continuation';

var initialize = function () {
  commander.version(meta.version);
  commander.usage('[options] <script> [arguments]');
  commander.option('-p, --print', 'compile script file and print it');
  commander.option('-o, --output <filename>', 'compile script file and save as <filename>');
  commander.option('-e, --explicit', 'compile only if "use continuation" is explicitly declared');
  commander.option('-c, --cache [directory]', 'enable compilation cache to [directory], by default [directory] is '
      + cacheDefaultPath);
  commander.option('-d, --directory <directory>', 'recursively compile a directory and output to <directory>');
  commander.option('-v, --verbose', 'print verbose information to stderr');
  commander.parse(process.argv);
};

var main = exports.main = function () {
  initialize();

  var filename = commander.args[0];
  if (commander.explicit) {
    options.explicit = true;
  }
  if (commander.cache) {
    options.cache = commander.cache;
    if (options.cache === true) {
      options.cache = cacheDefaultPath;
    }
    process.umask(0);
  }
  if (commander.verbose) {
    options.verbose = true;
  }

  var stat;
  try {
    if (!filename) {
      throw new Error('You should specify a script file.');
    }
    stat = fs.statSync(filename);
    if (commander.directory) {
      if (!stat.isDirectory()) {
        throw new Error(filename + " must be a directory.");
      }
    } else {
      if (!stat.isFile()) {
        throw new Error(filename + " must be a file.");
      }
    }
  } catch (e) {
    printErrorAndTerminate(e.message);
  }

  if (stat.isFile()) {
    var code = compile(filename);
    var print = false;
    if (commander.print) {
      print = true;
    }
    if (commander.output) {
      print = true;
    }
    if (print) {
      // Print code to stdout or specified file.
      outputCode(filename, code);
    } else {
      // Execute code.
      executeTopModule(code, filename);
    }
  } else if (stat.isDirectory()) {
    compileRecursive(filename, commander.directory);
  }
};

var printErrorAndTerminate = function(message) {
  console.error("Continuation.js error:");
  console.error(message);
  console.error(commander.helpInformation());
  process.exit(-1);
};

var outputCode = function (originalFilename, code) {
  if (commander.output) {
    var filename = commander.output;
    if (options.sourceMap) {
      var sourceMapFilename = filename + '.map';
      var sourceMap = continuation.getSourceMap(
        path.basename(filename),
        [path.basename(originalFilename)]
      );
      code += '\n//@ sourceMappingURL=' + path.basename(sourceMapFilename);
      fs.writeFileSync(sourceMapFilename, sourceMap);
    }
    fs.writeFileSync(filename, code);
  } else {
    console.log(code);
  }
};

var executeTopModule = function (code, filename) {
  //Set current module information
  var mainModule = require.main;
  mainModule.filename = filename;
  mainModule.moduleCache = {};
  mainModule.children = [];
  mainModule.paths = calculatePaths(filename);
  //Register require handler
  registerRequire();
  //Generate program arguments
  var args = commander.args.slice(1);
  process.argv = [process.argv[0], filename].concat(args);
  //Run
  mainModule._compile(code, filename);
};

var registerRequire = function() {
  require.extensions['.ls'] = execute;
  require.extensions['.js'] = execute;
  require.extensions['.coffee'] = execute;
};

var compile = function (filename) {
  var code;
  if (options.cache) {
    code = readCache(filename);
    if (code !== null) {
      return code;
    }
  }
  try {
    code = fs.readFileSync(filename, 'utf-8');
    var ext = path.extname(filename);
    if (ext === '.coffee') {
      //Coffee-script support
      if (!coffeescript) {
        console.error('CoffeeScript not found. Use: npm install -g coffee-script');
        process.exit(-1);
      }
      code = coffeescript.compile(code);
    } else if (ext === '.ls') {
      //LiveScript support
      if (!livescript) {
        console.error('LiveScript not found. Use: npm install -g LiveScript');
        process.exit(-1);
      }
      code = livescript.compile(code);
    }
    code = continuation.compile(code, options);
  } catch (err) {
    console.error('In file', filename);
    console.error(err.stack);
    process.exit(-1);
  }
  if (options.cache) {
    if (options.verbose) {
      console.error('Updated ' + filename);
    }
    writeCache(filename, code);
  }
  return code;
};

var execute = function (module, filename) {
  global.currentFilename = filename;
  var code = compile(filename);
  module._compile(code, filename);
};

var calculatePaths = function (filename) {
  var paths = [];
  var pathSec = path.dirname(path.resolve(filename)).split(path.sep);
  while (pathSec.length > 0) {
    var modulePath = pathSec.join(path.sep);
    modulePath += path.sep + 'node_modules';
    paths.push(modulePath);
    pathSec.pop();
  }
  return paths;
};

var getCachedFilePath = function(filename) {
  return path.join(options.cache, filename + '.cont.js');
};

var readCache = function (filename) {
  var cachedFilePath = getCachedFilePath(filename);
  var exists = fs.existsSync(cachedFilePath);
  if (!exists) {
    return null;
  }

  var stat = fs.lstatSync(cachedFilePath);
  var cacheMtime = stat.mtime;
  stat = fs.lstatSync(filename);
  var sourceMtime = stat.mtime;

  if (sourceMtime > cacheMtime) {
    return null;
  }

  return fs.readFileSync(cachedFilePath, 'utf-8');
};

var writeCache = function (filename, code) {
  var cachedFilePath = getCachedFilePath(filename);

  //Fix for Windows style path
  cachedFilePath = cachedFilePath.replace(':', '');

  mkdirp.sync(path.dirname(cachedFilePath), 0777);
  fs.writeFileSync(cachedFilePath, code);
  fs.chmodSync(cachedFilePath, 0777);
};

var compileRecursive = function(source, target) {
  try {
    var files = fs.readdirSync(source);
    for (var i = 0; i < files.length; i++) {
      var file = path.join(source, files[i]);
      var dest = path.join(target, path.basename(file));
      var stat = fs.statSync(file);
      if (stat.isFile()) {
        var extname = path.extname(file);
        mkdirp.sync(target, 0755);
        if (extname === '.js' || extname === '.coffee' || extname === '.ls') {
          var code = compile(file);
          dest = path.join(path.dirname(dest), path.basename(dest, extname) + '.js');
          fs.writeFileSync(dest, code);
        } else {
          fs.writeFileSync(dest, fs.readFileSync(file));
        }
        if (commander.verbose) {
          console.log(file + ' -> ' + dest);
        }
      } else if (stat.isDirectory()) {
        compileRecursive(file, dest);
      }
    }
  } catch (e) {
    printErrorAndTerminate(e.stack);
  }
};
