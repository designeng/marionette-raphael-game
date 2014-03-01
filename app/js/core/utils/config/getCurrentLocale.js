define(["_.str"], function() {
  var getCurrentLocale;
  return getCurrentLocale = function(options) {
    var locale;
    locale = requirejs.s.contexts._.config.locale;
    if (options && options.uppercase) {
      locale = _.str.classify.call(this, locale);
    }
    return locale;
  };
});
