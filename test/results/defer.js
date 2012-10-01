var fs, err, text, util;
fs = require('fs');
(function (cont) {
  try {
    fs.readFile('continuation.j', 'utf-8', function () {
      try {
        err = arguments[0];
        text = arguments[1];
        if (err)
          throw err;
        console.log(text);
        cont();
      } catch (err) {
        cont(err);
      }
    });
  } catch (err) {
    cont(err);
  }
}(function (e) {
  if (e !== undefined) {
    util = require('util');
    console.error(util.inspect(e, false, null, true));
  }
}));