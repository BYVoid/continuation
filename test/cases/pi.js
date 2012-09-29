var calcPi = function (callback) {
  var f = function (x, callback) {
    process.nextTick(continuation());
    if (x > 35000) return callback(0);
    var d;
    f(x + 4, continuation(d));
    callback(d + (1 / x - 1 / (x + 2)) * 4);
  };
  f(1, callback);
};

var pi;
calcPi(continuation(pi));
console.log(pi);
