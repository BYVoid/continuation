try {
  throw new Error('my error');
} catch(err) {
  setTimeout(cont(), 10);
  console.log(err);
}
console.log('Done');
