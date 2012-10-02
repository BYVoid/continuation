try {
  var a = 1;
  var err = 'some-error';
  setTimeout(cont(), 200);
  JSON.parse('invalid-json');
  if (err) throw err;
  a = 2;
} catch(err) {
  console.log(err);
}
console.log('Done');
