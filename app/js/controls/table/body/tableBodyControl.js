define(["backbone", "marionette", "controls/table/row/tableRowControl", "controls/table/empty/emptyItemView"], function(Backbone, Marionette, TableRowControl, EmptyItemView) {
  var TableBodyView;
  return TableBodyView = Marionette.CollectionView.extend({
    tagName: "tbody",
    itemView: TableRowControl,
    emptyView: EmptyItemView,
    initialize: function() {
      return this.applyOptions(["eventBus", "collection", "itemView", "columns"]);
    },
    itemViewOptions: function(model, index) {
      var options;
      return options = {
        columns: this.columns,
        itemHeight: this.itemHeight
      };
    },
    onBeforeRender: function() {
      return this.setHeight(this.itemHeight);
    },
    setHeight: function(h) {
      return this.$el.css("height", h);
    }
  });
});
