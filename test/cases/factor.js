var factor = function (n, callback) {
  if (n == 0) return callback(1);
  var rest;
  factor(n - 1, continuation(rest));
  setTimeout(continuation(), 1000);
  console.log(rest);
  callback(n * rest);
};

factor(6, continuation());
