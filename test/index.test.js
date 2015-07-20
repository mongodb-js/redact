var assert = require('assert');
var redact = require('../');

describe('mongodb-redact', function() {
  it('should work', function() {
    var res = redact({
      a: 1,
      b: 'blue',
      tags: ['a', 'b', 1]
    });
    assert.deepEqual(res, {
      a: 999.123,
      b: 'XXXX',
      tags: ['X', 'X', 999.123]
    });
  });
});
