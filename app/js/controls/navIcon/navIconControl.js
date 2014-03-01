define(["marionette", "baseControlWrapper"], function(Marionette, BaseControlWrapper) {
  var NavIconControlView, NavIconItemView, NavIconViewCollectionView;
  NavIconItemView = BaseControlWrapper.extend({
    tagName: "li"
  });
  NavIconViewCollectionView = Marionette.CollectionView.extend({
    tagName: "ul",
    itemView: NavIconItemView
  });
  NavIconControlView = Marionette.Layout.extend({
    className: function() {
      if (this.model) {
        return this.model.get("className");
      }
    },
    initialize: function(options) {
      var _this = this;
      this.context = Marionette.getOption(this, "context");
      this.model.get("items").each(function(model) {
        return model.set("context", _this.context);
      });
      return this.navIconViewCollectionView = new NavIconViewCollectionView({
        collection: this.model.get("items")
      });
    },
    onRender: function() {
      return this.$el.html(this.navIconViewCollectionView.render().el);
    }
  });
  return NavIconControlView;
});
