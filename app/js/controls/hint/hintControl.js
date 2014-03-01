define(["backbone", "marionette"], function(Backbone, Marionette) {
  var HintControlView;
  return HintControlView = Marionette.Layout.extend({
    template: "{{text}}",
    className: function() {
      return this.defaultClassName("hintControl");
    },
    initialize: function(options) {},
    onBeforeRender: function() {
      this.$el.css("width", this.model.get("width") + "px");
      this.$el.css("height", this.model.get("height") + "px");
      this.$el.css("background-color", this.model.get("bgColor"));
      return this.$el.css("border", "1px solid green");
    }
  });
});
