for (var i = 0;;i++) {
  setTimeout(cont(), 200);
  console.log('hello');
  if (i == 5) {
    break;
  }
}
