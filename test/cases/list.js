function delay(num, callback) {
  setTimeout(continuation(), 10);
  callback(num);
}

var list = [];

for (var i = 0; i < 5; i++) {
  list.push(i);
}
console.log(list);

for (var i = 0; i < 5; i++) {
  delay(i * i, continuation(list[i]));
}
console.log(list);
