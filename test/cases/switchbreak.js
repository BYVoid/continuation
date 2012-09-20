var val = 'a';
var num = 1;

switch (val) {
  case 'a':
  if (num == 1)
    break;
  default:
    setTimeout(continuation(), 500);
    console.log('default');
}
