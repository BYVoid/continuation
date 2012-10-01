var fib;
fib = function () {
  var a, current, b;
  a = 0;
  current = 1;
  function loop_0(loop_0_cont) {
    if (true) {
      b = a;
      a = current;
      current = a + b;
      setTimeout(function () {
        console.log(current);
        loop_0(loop_0_cont);
      }, 1000);
    } else {
      loop_0_cont();
    }
  }
  loop_0(function () {
  });
};
fib();