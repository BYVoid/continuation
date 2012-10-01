try {
  setTimeout(continuation(), 200);
  throw new Error('my error');
} catch(err) {
  console.log('Error caught:');
  setTimeout(continuation(), 1000);
  console.log(err);
} finally {
  console.log('Finally');
}
console.log('Done');
