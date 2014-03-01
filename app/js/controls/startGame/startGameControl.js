define(["backbone", "marionette", "when"], function(Backbone, Marionette, When) {
  var StartGameControl;
  return StartGameControl = Marionette.Layout.extend({
    className: function() {
      return this.defaultClassName("startGameControl");
    },
    events: {
      "click": "onClick"
    },
    initialize: function(options) {
      this.context = Marionette.getOption(this, "context");
      return console.log("CTX", this.context);
    },
    onRender: function() {
      return console.log("rendered start game");
    },
    onClick: function(e) {
      return console.log("clicked");
    }
  });
});
