define(["backbone"], function(Backbone) {
  var createDictionary;
  return createDictionary = function(items, data) {
    var dictionary, item, _i, _len;
    dictionary = {};
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      dictionary[item] = new Backbone.Collection(data.dictionary[item]);
    }
    return dictionary;
  };
});
