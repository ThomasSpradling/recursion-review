// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

// { key1: value1, key2: value2 }

// String: { key1 : stringifyJSON(value1), key2 : stringifyJSON(value2) }
// Arrays:[ value1, value2, value3 ]
  // For each in array, also call stringifyJSON(...)
// If primitive: .toString()
// Functions = bad ---> null
// null,  -->

// [a, b, [a, b, c],]

// [1, 2, 3, 4, 5]

var stringifyJSON = function(obj) {
  // your code goes here
  var str = '';

  if (Array.isArray(obj)) { // case1: array
    str += '[';
    for (var i = 0; i < obj.length - 1; i++) {
      var elementStr = stringifyJSON(obj[i]);
      str += elementStr + ',';
    }
    if (obj.length > 0) {
      str += stringifyJSON(obj[obj.length - 1]);
    }
    str += ']';
  } else if (obj === null) {
    str += 'null';
  } else if (typeof obj === 'object') { // case2: object
    str += '{';
    for (var key in obj) {
      var keyStr = stringifyJSON(key);
      var valueStr = stringifyJSON(obj[key]);
      if (valueStr !== '') {
        str += keyStr + ':' + valueStr + ',';
      }
    }
    if (str.length > 1) {
      str = str.slice(0, -1);
    }
    str += '}';
  } else if (typeof obj === 'string') { // case3：string '"'
    str += '"' + obj + '"';
  } else if (typeof obj === 'number' || typeof obj === 'boolean') { // case 4: other primitives
    str += obj.toString();
  } else {
    str += '';
  }
  return str;
};

// expected '{}' to equal '{"a":"apple"}'
// AssertionError: expected '{"functions":}' to equal '{}'