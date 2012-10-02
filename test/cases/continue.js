for (var i = 0; i < 10; i++) {
  setTimeout(cont(), 300);
  if (i == 3) continue;
  console.log(i);
}
