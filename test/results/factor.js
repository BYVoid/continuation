var factor = function (n, callback) {
    if (n == 0) {
        return callback(1);
    }
    factor(n - 1, function () {
        var rest = arguments[0];
        setTimeout(function () {
            console.log(rest);
            callback(n * rest);
        }, 1000);
    });
};
factor(6, function () {
});