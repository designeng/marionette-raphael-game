define(["underscore"], function(_) {
  var getItemStringLength;
  return getItemStringLength = function(item) {
    var attr, length, val, words;
    length = 0;
    words = 0;
    for (attr in item.attributes) {
      val = item.attributes[attr];
      if (_.isString(val)) {
        length += val.length;
        words++;
      }
    }
    length += words;
    return length;
  };
});
