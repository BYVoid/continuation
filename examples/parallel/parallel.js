var fs = require('fs');
var dns = require('dns');
var http = require('http');

var complexWork = function (next) {
  setTimeout(cont(), 500);
  http.get('http://www.byvoid.com', cont(res));
  next(null, res.headers);
};

parallel(
  fs.readdir('/', obtain(files)),
  dns.resolve('npmjs.org', obtain(addresses)),
  complexWork(obtain(result))
);

console.log(files, addresses, result);
