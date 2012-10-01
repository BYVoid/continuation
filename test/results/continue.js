var i;
i = 0;
function loop_0(loop_0_cont) {
    if (i < 10) {
        setTimeout(function () {
            if (i == 3) {
                return i++, loop_0(loop_0_cont);
            }
            console.log(i);
            i++;
            loop_0(loop_0_cont);
        }, 300);
    } else {
        loop_0_cont();
    }
}
loop_0(function () {
});