define(["core/utils/locale/prepareLocalized", "core/utils/view/applyModelPropertiesToViewProperties", "core/utils/options/applyOptions", "i18n!nls/general"], function(prepareLocalized, applyModelProperties, applyOptions, localized, asEventStream) {
  var BaseViewObject;
  return BaseViewObject = {
    _attrPrefix: "_",
    localized: localized,
    prepareLocalized: prepareLocalized,
    defaultClassName: function(name) {
      if (this.model.has("className")) {
        return this.model.get("className");
      } else {
        return name;
      }
    },
    applyModelProperties: function(properties, options) {
      return applyModelProperties.call(this, properties, options);
    },
    applyOptions: function(options, opt) {
      return applyOptions.call(this, options, opt);
    }
  };
});
