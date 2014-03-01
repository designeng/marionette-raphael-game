define(["underscore", "flat"], function(_, flat) {
  var attributesToString;
  return attributesToString = function(obj) {
    var attr, fl, str, _obj;
    str = "";
    if (obj.attributes) {
      _obj = obj.attributes;
    } else {
      _obj = obj;
    }
    fl = flat.flatten(_obj);
    for (attr in fl) {
      str += attr + ': "' + fl[attr] + '"\n';
    }
    return str;
  };
});
