try {
  throw new Error('my error');
} catch(err) {
  setTimeout(cont(), 1000);
  console.log(err);
}
console.log('Done');
