var x = ['A', 15, 4.67, true]
for (var i in x) {
  console.log(x[i]);
  setTimeout(cont(), 10);
}
