(function() {
  define(["core/utils/options/applyOptions"], function(applyOptions) {
    var BaseControllerObject;
    BaseControllerObject = {
      applyOptions: function(options, opt) {
        return applyOptions.call(this, options, opt);
      }
    };
    return BaseControllerObject;
  });

}).call(this);
