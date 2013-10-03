var f = function (i, next) {
  setTimeout(function () {
    if (i === 20) {
      next(new Error('my exception'));
    } else {
      next(null, i);
    }
  }, i);
}

var r = [];
try {
  parallel(
    f(50, obtain(r[0])),
    f(100, obtain(r[1])),
    f(20, obtain(r[2])),
    f(10, obtain(r[3]))
  )
} catch(err) {
  console.log(err);
}
console.log('Done');
