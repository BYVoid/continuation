var calcPi = function (callback) {
  var f = function (x, callback) {
    if (x > 4000) return callback(0);
    f(x + 4, cont(d));
    callback(d + (1 / x - 1 / (x + 2)) * 4);
  };
  f(1, callback);
};

calcPi(cont(pi));
console.log(pi);
