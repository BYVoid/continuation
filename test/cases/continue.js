for (var i = 0; i < 10; i++) {
  setTimeout(continuation(), 300);
  if (i == 3) continue;
  console.log(i);
}
