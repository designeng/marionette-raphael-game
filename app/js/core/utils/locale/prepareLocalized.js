define(["underscore"], function(_) {
  var prepareLocalized;
  prepareLocalized = function(opt, resultMode) {
    var o, option, optionTail, options, prepared, resObj, _i, _j, _len, _len1;
    prepared = [];
    options = [];
    if (_.isString(opt)) {
      options.push(opt);
    } else if (_.isArray(opt)) {
      options = _.flatten(opt);
    } else if (_.isObject(opt)) {
      for (_i = 0, _len = opt.length; _i < _len; _i++) {
        o = opt[_i];
        if (_.isString(o)) {
          options.push(o);
        } else {
          throw new Error("PrepareLocalized arg structure is too complex!");
        }
      }
    }
    for (_j = 0, _len1 = options.length; _j < _len1; _j++) {
      option = options[_j];
      if (option && option.slice(0, 4) === "loc_") {
        optionTail = option.slice(4);
        if (this.localized[optionTail]) {
          if (resultMode === "object") {
            resObj = {};
            resObj[optionTail] = this.localized[optionTail];
            prepared.push(resObj);
          } else {
            prepared.push(this.localized[optionTail]);
          }
        } else {
          throw new Error("No accordance in localized for " + option + "!");
        }
      } else {
        prepared.push(option);
      }
    }
    if (resultMode === "string") {
      return prepared[0];
    } else {
      return prepared;
    }
  };
  return prepareLocalized;
});
