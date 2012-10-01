var fs = require('fs');
function calcDirSize(path, callback) {
    var dirSize = 0;
    var dirBlockSize = 0;
    fs.readdir(path, function () {
        var err = arguments[0];
        var files = arguments[1];
        var i = 0;
        var filename;
        function loop_0(loop_0_cont) {
            if (i < files.length) {
                filename = path + '/' + files[i];
                fs.lstat(filename, function () {
                    var err = arguments[0];
                    var stats = arguments[1];
                    (function (cont) {
                        if (stats.isDirectory()) {
                            calcDirSize(filename, function () {
                                var err = arguments[0];
                                var subDirSize = arguments[1];
                                var subDirBlockSize = arguments[2];
                                dirSize += subDirSize;
                                dirBlockSize += subDirBlockSize;
                                cont();
                            });
                        } else {
                            dirSize += stats.size;
                            dirBlockSize += 512 * stats.blocks;
                            cont();
                        }
                    }(function () {
                        i++;
                        loop_0(loop_0_cont);
                    }));
                });
            } else {
                loop_0_cont();
            }
        }
        loop_0(function () {
            callback(null, dirSize, dirBlockSize);
        });
    });
}
var path = process.argv[2];
if (!path) {
    path = '.';
}
calcDirSize(path, function () {
    var err = arguments[0];
    var totalSize = arguments[1];
    var totalBlockSize = arguments[2];
    console.log('Size:', Math.round(totalSize / 1024), 'KB');
    console.log('Actual Size on Disk:', Math.round(totalBlockSize / 1024), 'KB');
});