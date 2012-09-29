var calcPi = function (callback) {
  var f = function (x, callback) {
    process.nextTick(continuation());
    if (x > 10000) return callback(0);
    f(x + 4, continuation(d));
    callback(d + (1 / x - 1 / (x + 2)) * 4);
  };
  f(1, callback);
};

calcPi(continuation(pi));
console.log(pi);
