var val = 'a';
var num = 1;
(function (cont) {
    function case_0(cont) {
        if (num == 1) {
            return cont();
        }
        case_1(cont);
    }
    function case_1(cont) {
        setTimeout(function () {
            console.log('default');
            cont();
        }, 500);
    }
    switch (val) {
    case 'a':
        return case_0(cont);
    default:
        return case_1(cont);
    }
}(function () {
}));