var fs = require('fs');

function calcDirSize(path, callback) {
  var dirSize = 0, dirBlockSize = 0;
  fs.readdir(path, defer(files));
  for (var i = 0; i < files.length; i++) {
    var filename = path + '/' + files[i];
    fs.lstat(filename, defer(stats));
    if (stats.isDirectory()) {
      calcDirSize(filename, defer(subDirSize, subDirBlockSize));
      dirSize += subDirSize;
      dirBlockSize += subDirBlockSize;
    } else {
      dirSize += stats.size;
      dirBlockSize += 512 * stats.blocks;
    }
  }
  callback(null, dirSize, dirBlockSize);
}

var path = process.argv[2];
if (!path) path = '.';

calcDirSize(path, defer(totalSize, totalBlockSize));

console.log('Size:', Math.round(totalSize / 1024), 'KB');
console.log('Actual Size on Disk:', Math.round(totalBlockSize / 1024), 'KB');
