var fs = require('fs');
function calcDirSize(path, callback) {
    var dirSize = 0;
    var dirBlockSize = 0;
    var err;
    var files;
    fs.readdir(path, function () {
        err = arguments[0];
        files = arguments[1];
        var i = 0;
        var filename;
        var subDirSize;
        var subDirBlockSize;
        function loop_0(loop_0_cont) {
            if (i < files.length) {
                filename = path + '/' + files[i];
                fs.lstat(filename, function () {
                    err = arguments[0];
                    stats = arguments[1];
                    (function (cont) {
                        if (stats.isDirectory()) {
                            calcDirSize(filename, function () {
                                err = arguments[0];
                                subDirSize = arguments[1];
                                subDirBlockSize = arguments[2];
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
} else {
}
var err;
var totalSize;
var totalBlockSize;
calcDirSize(path, function () {
    err = arguments[0];
    totalSize = arguments[1];
    totalBlockSize = arguments[2];
    console.log('Size:', Math.round(totalSize / 1024), 'KB');
    console.log('Actual Size on Disk:', Math.round(totalBlockSize / 1024), 'KB');
});