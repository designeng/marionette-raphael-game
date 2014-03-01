define(["backbone", "backbone.raphael", "marionette", "when"], function(Backbone, RaphaelView, Marionette, When) {
  var GameControl;
  GameControl = Marionette.Layout.extend({
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
    onRender: function() {
      return console.log("rendered");
    },
    onClick: function(e) {
      return console.log("clicked");
    }
  });
  GameControl = _.extend(GameControl, RaphaelView);
  return GameControl;
});
