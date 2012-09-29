(function (cont) {
    function case_0(cont) {
        a = 1;
        cont();
    }
    function case_1(cont) {
        fs.readFile('e.js', function () {
            var err = arguments[0];
            var text = arguments[1];
            cont();
        });
    }
    function case_2(cont) {
        fs.readFile('e.js', function () {
            var err = arguments[0];
            var text = arguments[1];
            case_3(cont);
        });
    }
    function case_3(cont) {
        (function (cont) {
            if (a) {
                d = 1;
                return cont();
                cont();
            } else {
                setTimeout(function () {
                    cont();
                });
            }
        }(function () {
            case_4(cont);
        }));
    }
    function case_4(cont) {
        console.log('stop');
        cont();
    }
    switch (val) {
    case 'a':
        return case_0(cont);
    case 'b':
        return case_1(cont);
    case 'c':
        return case_2(cont);
    case 'd':
        return case_3(cont);
    default:
        return case_4(cont);
    }
}(function () {
    var end = 'a';
}));