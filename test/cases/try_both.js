try {
  setTimeout(cont(), 20);
  throw new Error('my error');
} catch(err) {
  console.log('Error caught:');
  setTimeout(cont(), 10);
  console.log(err);
} finally {
  console.log('Finally');
}
console.log('Done');
