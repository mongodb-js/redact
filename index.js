var each = require('lodash.foreach');

function getType(value) {
  return Object.prototype.toString.call(value).replace(/\[object (\w+)\]/, '$1');
}

function redact(value) {
  var type = getType(value);
  if (type === 'Array') {
    return value.map(redact);
  }

  if (type === 'Object') {
    var res = {};
    each(value, function(v, k) {
      res[k] = redact(v);
    });
    return res;
  }

  if (type === 'Number') {
    return 999.123;
  }

  if (type === 'String') {
    var s = '';
    for (var i = 0; i < value.length; i++) {
      s += 'X';
    }
    return s;
  }

  return value;
}

module.exports = function(doc) {
  return redact(doc);
};
