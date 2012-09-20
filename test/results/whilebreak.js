var i = 0;
function loop_1(loop_1_cont) {
    if (true) {
        setTimeout(function () {
            console.log('hello');
            if (i == 5) {
                return loop_1_cont();
            } else {
            }
            i++;
            loop_1(loop_1_cont);
        }, 200);
    } else {
        loop_1_cont();
    }
}
loop_1(function () {
});