this.name = ('outter');

function inner() {
  if (true) {
    setTimeout(cont(), 100);
    console.log(this.name);
  }
};

var o = {
  name: 'inner',
  inner: inner
};

o.inner();
console.log(this.name);
