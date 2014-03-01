define(["_.str"], function() {
  var applyModelPropertiesToViewProperties;
  return applyModelPropertiesToViewProperties = function() {
    var attr, attrToLower, attrs, options, prefix, _i, _len, _results;
    if (!this.model) {
      throw new Error("Model is not defined!");
    }
    attrs = _.toArray(arguments).slice(0);
    options = _.last(attrs);
    if (_.isObject(options) && options.prefix) {
      prefix = options["prefix"];
    } else {
      prefix = "";
    }
    attrs = _.first(attrs);
    _results = [];
    for (_i = 0, _len = attrs.length; _i < _len; _i++) {
      attr = attrs[_i];
      if (this.model.has(attr)) {
        this[prefix + attr] = this.model.get(attr);
        attrToLower = attr.toLowerCase();
        if (_.str.endsWith.call(this, attrToLower, "width") || _.str.endsWith.call(this, attrToLower, "height")) {
          _results.push(this[prefix + attr + "Px"] = this.model.get(attr) + "px");
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
});
