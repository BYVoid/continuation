var calcPi = function (callback) {
    var f = function (x, callback) {
        process.nextTick(function () {
            if (x > 35000) {
                return callback(0);
            } else {
            }
            var d;
            f(x + 4, function () {
                d = arguments[0];
                callback(d + (1 / x - 1 / (x + 2)) * 4);
            });
        });
    };
    f(1, callback);
};
var pi;
calcPi(function () {
    pi = arguments[0];
    console.log(pi);
});