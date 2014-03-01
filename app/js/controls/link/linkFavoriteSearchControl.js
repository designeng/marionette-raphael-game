define(["marionette", "linkControl"], function(Marionette, LinkControl) {
  var FavoriteSearchControlView;
  return FavoriteSearchControlView = LinkControl.extend({
    className: "flightSearchHistory__favorite",
    template: "{{count}}",
    initialize: function() {
      this.context = Marionette.getOption(this, "context");
      this.listenTo(this.model, 'change', this.render);
      return this.listenTo(this.context, 'hideFavorite', this.hideFavorite);
    },
    onRender: function() {
      return this.checkFavoriteEnable();
    },
    checkFavoriteEnable: function() {
      if (this.model.get('count') > 0) {
        return this.show(true);
      } else {
        return this.show(false);
      }
    },
    show: function(state) {
      if (state) {
        return this.$el.show();
      } else {
        return this.$el.hide();
      }
    },
    onClick: function() {
      alert('favorite click');
      return false;
    },
    hideFavorite: function() {
      return this.show(false);
    }
  });
});
