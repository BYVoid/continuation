/* Generated by Continuation.js v0.1.0 */
var err, text, a;
(function (_$cont) {
  if (bool) {
    if (a) {
      a = b;
    }
    fs.readFile('e.js', function () {
      err = arguments[0];
      text = arguments[1];
      _$cont();
    });
  } else {
    setTimeOut(function () {
      (function (_$cont) {
        if (c == 1) {
          fs.readFile('e.js', function () {
            err = arguments[0];
            text = arguments[1];
            _$cont();
          });
        } else {
          _$cont();
        }
      }(function (_$err) {
        if (_$err !== undefined)
          return _$cont(_$err);
        _$cont();
      }));
    }, 1000);
  }
}(function (_$err) {
  if (_$err !== undefined)
    return _$cont(_$err);
  a = err;
}));