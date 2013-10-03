var fib = function () {
  var a = 0, current = 1;
  while (true) {
    var b = a;
    a = current;
    current = a + b;
    setTimeout(cont(), 20);
    console.log(current);
    if (a > 100) {
      break;
    }
  }
};

fib();
