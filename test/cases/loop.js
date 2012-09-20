var fs = require('fs');

for (var i = 0; i < 4; i++) {
  var err, text;
  fs.readFile('node.txt', 'utf-8', continuation(err, text));
  console.log(err, text);
}

console.log('Done');
