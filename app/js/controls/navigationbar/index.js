(function() {
  define(["marionette", "baseControlWrapper"], function(Marionette, BaseControlWrapper) {
    var ActiveModel, NavigationCollectionItemView, NavigationCollectionView, NavigationView;
    ActiveModel = Backbone.Model.extend;
    NavigationCollectionItemView = BaseControlWrapper.extend({
      tagName: "li"
    });
    NavigationCollectionView = Marionette.CollectionView.extend({
      itemView: NavigationCollectionItemView,
      tagName: "ul"
    });
    NavigationView = Marionette.Layout.extend({
      className: function() {
        if (this.model) {
          return this.model.get("className");
        }
      },
      initialize: function(options) {
        var _this = this;
        this.activityRegistrator = this.model.get("activityRegistrator");
        if (!this.model) {
          return;
        }
        this.context = this.model.get("context");
        this.items = this.model.get("items");
        this.items.each(function(model) {
          model.set("context", _this.context);
          model.set("activityRegistrator", _this.activityRegistrator);
          if (!model.has("controlType")) {
            return model.set("controlType", "linkControl");
          }
        });
        this.navigationCollectionView = new NavigationCollectionView({
          collection: this.items
        });
        _.bindAll(this, "onChildControlClick", "onChangeCurrentActiveModel");
        this.context.on("childControl:click", this.onChildControlClick);
        this.model.set("_currentActiveModel", new ActiveModel());
        return this.model.on("change:_currentActiveModel", this.onChangeCurrentActiveModel);
      },
      onChildControlClick: function(eData) {
        return this.model.set("_currentActiveModel", eData.model);
      },
      onChangeCurrentActiveModel: function(model) {
        var item, _model;
        _model = model.get("_currentActiveModel");
        return item = this.navigationCollectionView.children.findByModel(_model);
      },
      onRender: function() {
        return this.$el.html(this.navigationCollectionView.render().el);
      }
    });
    return NavigationView;
  });

}).call(this);
