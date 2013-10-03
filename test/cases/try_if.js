try {
  if (true) {
    setTimeout(cont(), 100);
    console.log('throw err');
    throw 'Err';
  } else {throw 'Else Err';}
  console.log('after if');
} catch (err) {
  console.log(err);
}

console.log('Done');
