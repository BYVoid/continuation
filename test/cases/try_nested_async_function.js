// regression test for issue #4
var main = function (callback) {
  try {
    setTimeout(cont(), 0);
    var result = 0;
    [10, 20, 30].forEach(function (i) {
      result += i;
      setTimeout(cont(), 0);
      throw Error('Oops');
    });
  }
  catch (e) {
    callback(e);
    return;
  }
  callback(null, result);
};
main(cont(err, res));
console.log('main() finished with', err, res);
