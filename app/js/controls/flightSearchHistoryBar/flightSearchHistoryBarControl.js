define(["marionette", "baseControlWrapper", "buttonControl", "buttonModel"], function(Marionette, BaseControlWrapper, ButtonControl, ButtonModel) {
  var NavigationCollectionItemView, NavigationCollectionView, NavigationLayout;
  NavigationCollectionItemView = BaseControlWrapper.extend({
    tagName: "li",
    className: "flightSearchHistory__listItem",
    template: "<div class='flightSearchHistory__listItemClose'></div>",
    initialize: function() {
      BaseControlWrapper.prototype.initialize.call(this);
      return this.itemModel = Marionette.getOption(this, "model");
    },
    renderInnerControl: function(view) {
      this.$el.append(view.render().el);
      if (this.itemModel.get('date')) {
        this.$el.append('<span class="flightSearchHistory__listItemDate">' + this.itemModel.get('date') + '</span>');
      }
      if (this.itemModel.get('plusMinus')) {
        return this.$el.append('<span class="flightSearchHistory__listItemDate">(±1)</span>');
      }
    }
  });
  NavigationCollectionView = Marionette.CollectionView.extend({
    itemView: NavigationCollectionItemView,
    className: "flightSearchHistory__list",
    tagName: "ul"
  });
  NavigationLayout = Marionette.Layout.extend({
    className: function() {
      if (this.model) {
        return this.model.get("className");
      }
    },
    initialize: function(options) {
      this.context = Marionette.getOption(this, "context");
      this.items = this.model.get("items");
      this.addContextToItems();
      return this.creatItemsCollection();
    },
    addContextToItems: function() {
      var _this = this;
      this.items.each(function(model) {
        model.set("context", _this.context);
        if (!model.has("controlType")) {
          return model.set("controlType", "linkControl");
        }
      });
      return this.context.on("childControl:click", this.onChildControlClick);
    },
    creatItemsCollection: function() {
      var elContext;
      elContext = this.context;
      NavigationCollectionView = NavigationCollectionView.extend({
        collection: this.items,
        onItemRemoved: function() {
          if (!this.children.length) {
            return elContext.trigger('hideFavorite');
          }
        }
      });
      return this.navigationCollectionView = new NavigationCollectionView;
    },
    onChildControlClick: function(eData) {
      return this.model.set("_currentActiveModel", eData.model);
    },
    onRender: function() {
      return this.$el.append(this.navigationCollectionView.render().el);
    }
  });
  return NavigationLayout;
});
