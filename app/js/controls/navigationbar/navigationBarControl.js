define(["marionette", "baseControl", "baseControlWrapper"], function(Marionette, BaseControl, BaseControlWrapper) {
  var NavigationCollectionItemView, NavigationCollectionView, NavigationView;
  NavigationCollectionItemView = BaseControlWrapper.extend({
    tagName: "li"
  });
  NavigationCollectionView = Marionette.CollectionView.extend({
    itemView: NavigationCollectionItemView,
    tagName: "ul"
  });
  return NavigationView = BaseControl.extend({
    className: function() {
      return this.defaultClassName("navigationBarControl");
    },
    initialize: function(options) {
      this.context = Marionette.getOption(this, "context");
      this.applyModelProperties(["items", "controlType"], {
        prefix: this._attrPrefix
      });
      this.navigationCollectionView = new NavigationCollectionView({
        collection: this.prepareItems(this._items, this.context, this._controlType)
      });
      _.bindAll(this, "onChildControlClick");
      return this.context.on("childControl:click", this.onChildControlClick);
    },
    prepareItems: function(items, context, controlType) {
      items.each(function(itemModel) {
        itemModel.set("context", context);
        if (!controlType) {
          return itemModel.set("controlType", "linkControl");
        }
      });
      return items;
    },
    onChildControlClick: function(eData) {
      return this.model.set("_currentActiveModel", eData.model);
    },
    onRender: function() {
      return this.$el.html(this.navigationCollectionView.render().el);
    }
  });
});
