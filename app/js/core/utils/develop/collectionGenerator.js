define(["backbone"], function(Backbone) {
  var collectionGenerator, randomStr;
  randomStr = function(l, mode) {
    var i, modes, text;
    modes = {
      letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      both: this.letters + this.numbers
    };
    i = 0;
    text = "";
    while (i < l) {
      text += modes[mode].charAt(Math.floor(Math.random() * modes[mode].length));
      i++;
    }
    return text;
  };
  return collectionGenerator = function(count, attributes, options) {
    var attr, c, collection, countforward, num, obj, _i, _j, _len, _len1;
    options = options || {};
    options["mode"] = options["mode"] || "letters";
    options["prefix"] = options["prefix"] || "item";
    collection = new Backbone.Collection();
    countforward = (function() {
      var _i, _results;
      _results = [];
      for (num = _i = 0; 0 <= count ? _i <= count : _i >= count; num = 0 <= count ? ++_i : --_i) {
        _results.push(num);
      }
      return _results;
    })();
    obj = {};
    for (_i = 0, _len = countforward.length; _i < _len; _i++) {
      c = countforward[_i];
      for (_j = 0, _len1 = attributes.length; _j < _len1; _j++) {
        attr = attributes[_j];
        if (options.mode) {
          obj[attr] = randomStr(5, options.mode);
        }
        obj[attr] += "_" + options.prefix + c;
      }
      c = new Backbone.Model(obj);
      collection.add(c);
    }
    return collection;
  };
});
