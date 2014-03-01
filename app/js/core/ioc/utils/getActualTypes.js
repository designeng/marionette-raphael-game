define(function() {
  var getActualTypes;
  return getActualTypes = function(str) {
    var item, itemTypeRx, matchs, t, types, _i, _len;
    types = [];
    itemTypeRx = /(itemType:\s*)("(.*?)")|(headerType:\s*)("(.*?)")|(bodyType:\s*)("(.*?)")|(innerComponentType:\s*)("(.*?)")/g;
    matchs = str.match(itemTypeRx);
    if (matchs) {
      for (_i = 0, _len = matchs.length; _i < _len; _i++) {
        item = matchs[_i];
        t = item.match(/Type:\s*/g);
        types.push(item.slice(item.indexOf(t[0]) + t[0].length).replace(/"/g, ""));
      }
    }
    types = _.uniq(types);
    return types;
  };
});
