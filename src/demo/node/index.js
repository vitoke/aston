const Aston = require('../../../dist/aston.node.js');

console.log(Aston);

const CONFIG = Aston.inject(
  { key: 'test', single: () => 1 },
  { key: 'foo', multi: () => 'hello ' }
);

console.log(CONFIG.get('test'));
console.log(CONFIG.get('foo'));
