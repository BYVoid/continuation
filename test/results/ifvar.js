var b, c, i, j, k, p;
(function (cont) {
    if (true) {
        b = 'b';
        process.nextTick(function () {
            c = 'c';
            cont();
        });
    } else {
        i = 1;
        while (i < 10) {
            if (1) {
                j = i;
            } else {
                j = i + 1;
                k = 0;
                while (true) {
                    p = k;
                }
            }
            i++;
        }
        cont();
    }
}(function () {
    console.log(b);
}));