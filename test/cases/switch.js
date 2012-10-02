switch (val) {
  case 'a':
    a = 1;
    break;
  case 'b':
    fs.readFile('e.js', cont(err, text));
    break;
  case 'c':
    fs.readFile('e.js', cont(err, text));
  case 'd':
    if (a) {
      d = 1;
      break;
    } else {
      setTimeout(cont());
    }
  default:
    console.log('stop');
}
var end = 'a';
