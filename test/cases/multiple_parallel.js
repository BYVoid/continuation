var test = function(value, callback) {
  console.log('called');
  callback(value);
};

parallel(
  test(1, cont(a)),
  test(2, cont(b)),
  test(3, cont(c))
);
console.log(a, b, c);

parallel(
  test(4, cont(d)),
  test(5, cont(e)),
  test(6, cont(f))
);
console.log(d, e, f);

