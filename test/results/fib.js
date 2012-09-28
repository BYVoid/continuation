var fib = function () {
    var a = 0;
    var current = 1;
    var b;
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