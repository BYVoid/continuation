if (bool) {
  if (a)
    a = b;
  fs.readFile('e.js', continuation(err, text));
} else {
  setTimeOut(continuation(), 1000);
  if (c == 1) {
    fs.readFile('e.js', continuation(err, text));
  }
}
var a = err;
