var x = ['A', 15, new Date(), true]
for (var i in x) {
  console.log(x[i]);
  setTimeout(cont(), 200);
}
