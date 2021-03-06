var assert = require('assert');
var redact = require('../');

/* eslint no-multi-str:0 */
var PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY----- \
MIICXgIBAAKBgQC8fAGwrWndvhjdgnkekAkWqGDUOOzTiiGNvAWwTwmLuI7SWCzi \
suFYjwyYaCwsJ1biyMlhiWKtFl4tGaEEYbDj4US8kRmaxmCKpXuN1mMKqVEtlZh8 \
vLpEFxz2KQpK0LrejAd8eLnCJCQtUIwJJf0btQMibAyxH0/SgSmwR/t18QIDAQAB \
AoGBALM9rhHI55sictz7fZjt2ma8mtBWjgihHEV/310J3IcNbGxlw9GV0Kx55L1u \
m0sl4f9qd++USc1WLxrue2wCRsbckw4PbQDtPD+7RXgO4bMuDeurHSDm0JSqj/P8 \
nvrOQ3wB8BPYJHebfMfOiMERptiDYlSExrHsDFNA1o7xGrwBAkEA31flS/fUShWW \
Zb9Ugw+qOPDTqifRvm9+EfzS0surU6ryfuX3NeZtj9R/vuYLRvfLaly/YEsmZdWX \
L/MLoHqhwQJBANgLSLiMRcFkAsNhRGs0UIXc7LB64Ba9HZ93oNwUZANbH53lWUaN \
0FeuVUUc2QDlkbV1DwlDBiCIaPb2GMQigDECQQDFsS2b0uCsOvOHWJZb9E++Wx1g \
biKwKEw1a87JG9KpGpXPUYtCwJaWS4hP15x/0vLRUQttFtgEJ83NeZr/D82BAkAP \
CeoL/qe0aJPQqeqrU77vMou/VS5YJt3zBc7KwxibKzKuORLX2HNSRy5kWze32kMk \
UHu1d1br2NMFrefXb1dhAkEAl5HshFiSCqPcPKeAU/0ndX8tTqhibNaJmnG9aX9r \
I1mP6zZWN3FLv8M/ISFROkTjs7HZQ81V7dvKmIymRUyQ7A== \
-----END RSA PRIVATE KEY-----';


describe('mongodb-redact', function() {
  describe('Types', function() {
    it('should work with string types', function() {
      var res = redact('foo@bar.com');
      assert.equal(res, '<email>');
    });

    it('should work with non-string types (no redaction)', function() {
      var res = redact(13);
      assert.equal(res, 13);
    });

    it('should work with array types', function() {
      var res = redact(['foo@bar.com', '192.168.0.5', 9, '/Users/john/apps/index.js']);
      assert.deepEqual(res, ['<email>', '<ip address>', 9, '/Users/<user>/apps/index.js']);
    });

    it('should work with object types', function() {
      var res = redact({
        email: 'foo@bar.com',
        ip: '192.168.0.5',
        number: 9,
        path: '/Users/john/apps/index.js'
      });
      assert.deepEqual(res, {
        email: '<email>',
        ip: '<ip address>',
        number: 9,
        path: '/Users/<user>/apps/index.js'
      });
    });
  });

  describe('Regexes', function() {
    it('should redact emails', function() {
      assert.equal(redact('some.complex+email@somedomain.co.uk'), '<email>');
    });

    it('should redact ip addresses', function() {
      assert.equal(redact('10.0.0.1'), '<ip address>');
    });

    it('should redact private keys', function() {
      assert.equal(redact(PRIVATE_KEY), '<private key>');
    });

    it('should redact OS X resource paths', function() {
      var res = redact('/Applications/MongoDB%20Compass.app/Contents/Resources/app/index.html');
      assert.equal(res, '/<path>/index.html');
    });

    it('should redact Windows resource paths using forward slash', function() {
      var res = redact('C:\\Users\\foo\\AppData\\Local\\MongoDBCompass\\app-1.0.1\\resources\\app\\index.js');
      assert.equal(res, '\\<path>\\index.js');
    });

    it('should redact Windows resource paths using backward slash', function() {
      var res = redact('C:/Users/foo/AppData/Local/MongoDBCompass/app-1.0.1/resources/app/index.js');
      assert.equal(res, '/<path>/index.js');
    });

    it('should redact Linux resource paths', function() {
      var res = redact('/usr/foo/myapps/resources/app/index.html');
      assert.equal(res, '/<path>/index.html');
    });

    it('should redact general Windows user paths', function() {
      var res = redact('c:\\Users\\JohnDoe\\test');
      assert.equal(res, 'c:\\Users\\<user>\\test');
      res = redact('C:\\Documents and Settings\\JohnDoe\\test');
      assert.equal(res, 'C:\\Documents and Settings\\<user>\\test');
    });

    it('should redact general OS X user paths', function() {
      var res = redact('/Users/JohnDoe/Documents/letter.pages');
      assert.equal(res, '/Users/<user>/Documents/letter.pages');
      res = redact('file:///Users/JohnDoe/Documents/letter.pages');
      assert.equal(res, 'file:///Users/<user>/Documents/letter.pages');
    });

    it('should redact URLs', function() {
      var res = redact('http://www.google.com');
      assert.equal(res, '<url>');
      res = redact('https://www.mongodb.org');
      assert.equal(res, '<url>');
      res = redact('https://www.youtube.com/watch?v=Q__3R5aUkWQ');
      assert.equal(res, '<url>');
    });

    it('should redact MongoDB connection URIs', function() {
      var res = redact('mongodb://db1.example.net,db2.example.net:2500/?replicaSet=test&connectTimeoutMS=300000');
      assert.equal(res, '<mongodb uri>');
      res = redact('mongodb://localhost,localhost:27018,localhost:27019');
      assert.equal(res, '<mongodb uri>');
    });

    it('should redact general linux/unix user paths', function() {
      var res = redact('/home/foobar/documents/tan-numbers.txt');
      assert.equal(res, '/home/<user>/documents/tan-numbers.txt');
      res = redact('/usr/foobar/documents/tan-numbers.txt');
      assert.equal(res, '/usr/<user>/documents/tan-numbers.txt');
      res = redact('/var/users/foobar/documents/tan-numbers.txt');
      assert.equal(res, '/var/users/<user>/documents/tan-numbers.txt');
    });

    it('should redact Compass Schema URL fragments', function() {
      var res = redact('index.html?connection_id=e5938750-038e-4cab-b2ba-9ccb9ed7e2a2#schema/db.collection');
      assert.equal(res, 'index.html?connection_id=e5938750-038e-4cab-b2ba-9ccb9ed7e2a2#schema/<namespace>');
    });
  });

  describe('Misc', function() {
    it('should redact strings with context', function() {
      var res = redact('send me an email to john.doe@company.com please.');
      assert.equal(res, 'send me an email to <email> please.');
    });

    it('should work on arrays of arrays', function() {
      var res = redact([['foo@bar.com', 'bar@baz.net'], 'http://github.com/mongodb-js']);
      assert.deepEqual(res, [['<email>', '<email>'], '<url>']);
    });

    it('should work on nested objects', function() {
      var res = redact({
        obj: {
          path: '/Users/thomas/something.txt'
        }
      });
      assert.deepEqual(res, {
        obj: {
          path: '/Users/<user>/something.txt'
        }
      });
    });
  });
});
