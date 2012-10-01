var calcPi = function (callback) {
    var f = function (x, callback) {
        process.nextTick(function () {
            if (x > 10000) {
                return callback(0);
            }
            f(x + 4, function () {
                var d = arguments[0];
                callback(d + (1 / x - 1 / (x + 2)) * 4);
            });
        });
    };
    f(1, callback);
};
calcPi(function () {
    var pi = arguments[0];
    console.log(pi);
});