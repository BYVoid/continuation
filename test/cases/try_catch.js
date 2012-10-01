try {
  throw new Error('my error');
} catch(err) {
  setTimeout(continuation(), 1000);
  console.log(err);
}
console.log('Done');
