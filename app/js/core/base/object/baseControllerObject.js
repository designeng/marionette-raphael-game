define(["core/utils/options/applyOptions", "i18n!nls/general", "core/utils/locale/prepareLocalized", "core/utils/frp/asEventStream"], function(applyOptions, localized, prepareLocalized, asEventStream) {
  var BaseControllerObject;
  BaseControllerObject = {
    localized: localized,
    prepareLocalized: prepareLocalized,
    applyOptions: function(options, opt) {
      return applyOptions.call(this, options, opt);
    },
    asEventStream: function(eventName, eventTransformer) {
      return asEventStream.call(this, eventName, eventTransformer);
    }
  };
  return BaseControllerObject;
});
