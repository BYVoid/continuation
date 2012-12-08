var f = function (i, next) {
  setTimeout(function () {
    console.log(i);
    next(i);
  }, i);
}

var r = [];
parallel(
  f(50, cont(r[0])),
  f(100, cont(r[1])),
  f(20, cont(r[2])),
  f(10, cont(r[3]))
)
console.log('Done', r);
