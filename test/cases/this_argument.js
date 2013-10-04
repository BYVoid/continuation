var Cons = function() {
  this.field = 1;
  this.showWithDelay = function() {
    var callback = arguments[arguments.length - 1];
    var delay = arguments[arguments.length - 2];
    setTimeout(cont(), delay);
    for (var i = 0; i < arguments.length - 2; i++) {
      console.log(arguments[i]);
    }
    console.log(this.field);
    callback();
  };
};

var obj = new Cons();
obj.showWithDelay(10, cont());
obj.showWithDelay("a", "b", 10, cont());
