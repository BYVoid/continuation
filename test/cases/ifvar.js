if (true) {
  var b = 'b';
  process.nextTick(cont());
  var c = 'c';
} else {
  for (var i = 1; i < 10; i++) {
    if (1) {
      var j = i;
    } else {
      var j = i + 1, k = 0;
      while (true) {
        var p = k;
      }
    }
  }
}
console.log(b);
