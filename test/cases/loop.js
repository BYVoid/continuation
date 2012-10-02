var fs = require('fs');

for (var i = 0; i < 4; i++) {
  fs.readFile('continuation.js', 'utf-8', cont(err, text));
  console.log(err, text);
}

console.log('Done');
