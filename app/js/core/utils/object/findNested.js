define(function() {
  var findNested;
  return findNested = function(obj, key, memo) {
    var i;
    i = void 0;
    if (Object.prototype.toString.call(memo) !== "[object Array]") {
      memo = [];
    }
    for (i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        if (i === key) {
          memo.push(obj[i]);
        } else {
          if (Object.prototype.toString.call(obj[i]) === "[object Object]") {
            findNested(obj[i], key, memo);
          }
        }
      }
    }
    return memo;
  };
});
