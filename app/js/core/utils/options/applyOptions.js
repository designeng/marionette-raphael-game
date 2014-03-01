define(["marionette"], function(Marionette) {
  var applyOptions;
  return applyOptions = function(options, opt) {
    var attr, attrs, prefix, _i, _len, _results;
    attrs = _.toArray(arguments).slice(0);
    opt = _.last(attrs);
    if (_.isObject(opt) && opt.prefix) {
      prefix = opt["prefix"];
    } else {
      prefix = "";
    }
    attrs = _.first(attrs);
    _results = [];
    for (_i = 0, _len = attrs.length; _i < _len; _i++) {
      attr = attrs[_i];
      _results.push(this[prefix + attr] = Marionette.getOption(this, attr));
    }
    return _results;
  };
});
