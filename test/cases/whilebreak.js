for (var i = 0;;i++) {
  setTimeout(continuation(), 200);
  console.log('hello');
  if (i == 5) {
    break;
  }
}
