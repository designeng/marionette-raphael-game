define(["backbone", "marionette"], function(Backbone, Marionette) {
  var EmptyItemView;
  return EmptyItemView = Marionette.ItemView.extend({
    template: "<td> No items </td>",
    tagName: "tr",
    initialize: function() {
      return this.applyOptions(["columns", "itemHeight"]);
    },
    onRender: function() {
      if (this.itemHeight) {
        return this.setHeight(this.itemHeight);
      }
    },
    setHeight: function(h) {
      return this.$el.css("height", h);
    }
  });
});
