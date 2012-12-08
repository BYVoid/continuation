var continuation = require('continuation');

function fibonacci() {
  var a = 0, current = 1;
  while (true) {
    var b = a;
    a = current;
    current = a + b;
    setTimeout(cont(), 1000);
    console.log(current);
  }
};

var code = fibonacci.toString();
var compiledCode = continuation.compile(code);
console.log(compiledCode);
eval(compiledCode);
fibonacci();
