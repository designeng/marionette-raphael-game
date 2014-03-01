(function() {
  define(["backbone", "marionette"], function(Backbone, Marionette) {
    var HintControlView, WrappedCollectionItemView, WrappedCollectionView;
    WrappedCollectionItemView = Marionette.ItemView.extend({
      template: "<a href='{{routeUrl}}'>{{text}}</a>",
      tagName: "li",
      className: "hintItem",
      events: {
        "click a": "onClick"
      },
      templateHelpers: {
        routeUrl: function() {
          return "#" + this.route;
        }
      },
      onClick: function(e) {
        return e.stopPropagation();
      }
    });
    WrappedCollectionView = Marionette.CollectionView.extend({
      itemView: WrappedCollectionItemView,
      tagName: "ul",
      className: "hint"
    });
    HintControlView = Marionette.Layout.extend({
      template: "<div class='hintViewWrapper'></div>",
      className: function() {
        return this.model.get("className");
      },
      regions: {
        hintViewWrapperRegion: ".hintViewWrapper"
      },
      initialize: function(options) {
        this.$el.css("width", this.model.get("width") + "px");
        if (this.model) {
          return this.context = this.model.get("context");
        }
      },
      onRender: function() {
        var wrappedView;
        if (!this.model) {

        } else {
          wrappedView = new WrappedCollectionView({
            collection: this.model.get("items")
          });
          return this.hintViewWrapperRegion.show(wrappedView);
        }
      }
    });
    return HintControlView;
  });

}).call(this);
