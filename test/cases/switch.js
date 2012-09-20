switch (val) {
  case 'a':
    a = 1;
    break;
  case 'b':
    fs.readFile('e.js', continuation(err, text));
    break;
  case 'c':
    fs.readFile('e.js', continuation(err, text));
  case 'd':
    if (a) {
      d = 1;
      break;
    } else {
      setTimeout(continuation());
    }
  default:
    console.log('stop');
}
var end = 'a';
