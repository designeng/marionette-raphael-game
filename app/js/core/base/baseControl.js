define(["backbone", "marionette"], function(Backbone, Marionette) {
  var BaseControl;
  return BaseControl = Marionette.Layout.extend({
    className: function() {
      if (this.model) {
        return this.model.get("className");
      }
    },
    initialize: function(options) {}
  });
});
