var i;
i = 0;
function loop_0(loop_0_cont) {
    if (true) {
        setTimeout(function () {
            console.log('hello');
            if (i == 5) {
                return loop_0_cont();
            }
            i++;
            loop_0(loop_0_cont);
        }, 200);
    } else {
        loop_0_cont();
    }
}
loop_0(function () {
});