(function() {
  define(["jquery", "marionette"], function($, Marionette) {
    var WindowResize, windowResize;
    WindowResize = Marionette.Controller.extend({
      initialize: function() {
        var _this = this;
        return $(window).resize(function() {
          return _this.trigger("window:resize", {
            width: $(window).width(),
            height: $(window).height()
          });
        });
      }
    });
    if (typeof windowResize === "undefined" || windowResize === null) {
      return windowResize = new WindowResize();
    }
  });

}).call(this);
