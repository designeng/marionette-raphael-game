define(["backbone", "marionette", "when"], function(Backbone, Marionette, When) {
  var GameControl;
  return GameControl = Marionette.Layout.extend({
    className: function() {
      return this.defaultClassName("gameControl");
    },
    events: {
      "click": "onClick"
    },
    initialize: function(options) {
      console.log("inited game control");
      this.context = Marionette.getOption(this, "context");
      return console.log("CTX", this.context);
    },
    onRender: function() {},
    onClick: function(e) {
      return console.log("clicked");
    }
  });
});
