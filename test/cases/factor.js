var factor = function (n, callback) {
  if (n == 0) return callback(1);
  factor(n - 1, cont(rest));
  setTimeout(cont(), 50);
  console.log(rest);
  callback(n * rest);
};

factor(6, cont());
