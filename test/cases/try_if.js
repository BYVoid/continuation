try {
  if (true) {
    setTimeout(cont(), 100);
    console.log('throw err');
    throw 'Err';
  } else {throw 'Else Err';}
  console.log('after if');
} catch (err) {
  console.error(err);
  return;
}

console.log('Done');

