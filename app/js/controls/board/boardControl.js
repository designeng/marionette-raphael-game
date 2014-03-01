define(["backbone", "backbone.raphael", "marionette", "when"], function(Backbone, RaphaelView, Marionette, When) {
  var BoardControl;
  BoardControl = Marionette.Layout.extend({
    className: function() {
      return this.defaultClassName("board");
    },
    events: {
      "click": "onClick"
    },
    initialize: function(options) {
      console.log("inited board control");
      this.context = Marionette.getOption(this, "context");
      return console.log("CTX", this.context);
    },
    onRender: function() {
      return console.log("rendered board");
    },
    onClick: function(e) {
      return console.log("clicked");
    }
  });
  BoardControl = _.extend(BoardControl, RaphaelView);
  return BoardControl;
});
