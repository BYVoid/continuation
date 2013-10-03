var fs = require('fs');

try {
  fs.readFile('/not/exist', 'utf-8', obtain(text));
  console.log(text);
} catch (e) {
  console.log(e);
}
