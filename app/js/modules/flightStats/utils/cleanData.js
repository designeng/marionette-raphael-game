define(function() {
  var cleanData;
  return cleanData = function(target) {
    var args, arr, field, _i, _len, _results;
    args = Array.prototype.slice.call(arguments, 1);
    if (_.isString(args)) {
      arr = [].push(args);
    } else {
      arr = _.clone(args);
    }
    _results = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      field = arr[_i];
      _results.push(delete target[field]);
    }
    return _results;
  };
});
