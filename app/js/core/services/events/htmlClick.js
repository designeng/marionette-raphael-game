(function() {
  define(["jquery", "marionette"], function($, Marionette) {
    var HtmlClick, htmlClick;
    HtmlClick = Marionette.Controller.extend({
      initialize: function() {
        var _this = this;
        return $("html").click(function(e) {
          return _this.trigger("html:click", e);
        });
      }
    });
    if (typeof htmlClick === "undefined" || htmlClick === null) {
      return htmlClick = new HtmlClick();
    }
  });

}).call(this);
