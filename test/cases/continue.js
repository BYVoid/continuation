for (var i = 0; i < 5; i++) {
  setTimeout(cont(), 10);
  if (i == 3) continue;
  console.log(i);
}
