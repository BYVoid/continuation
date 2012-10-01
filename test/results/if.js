(function (cont) {
    if (bool) {
        if (a) {
            a = b;
        }
        fs.readFile('e.js', function () {
            var err = arguments[0];
            var text = arguments[1];
            cont();
        });
    } else {
        setTimeOut(function () {
            (function (cont) {
                if (c == 1) {
                    fs.readFile('e.js', function () {
                        var err = arguments[0];
                        var text = arguments[1];
                        cont();
                    });
                } else {
                    cont();
                }
            }(function () {
                cont();
            }));
        }, 1000);
    }
}(function () {
    var a = err;
}));