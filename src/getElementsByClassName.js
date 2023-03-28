// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:

// document.body (is class name? Y --> add it to list. N --> don't add)
//
// node.childNodes
// element.classList
// [a, b, c] + [d, e] = [a, b, ]
var getElementsByClassName = function(className, current) {
  // your code here
  var current = current || document.body;

  var res = [];

  if (_(current.classList).some(function(e) { return e === className; })) {
    res.push(current);
  }

  current.children.forEach(function(element) {
    var classList = getElementsByClassName(className, element);
    res = res.concat(classList);
  });

  return res;
};