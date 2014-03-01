define(["marionette", "linkControl"], function(Marionette, LinkControl) {
  var NavigationCompositeView;
  return NavigationCompositeView = Marionette.CompositeView.extend({
    itemView: function() {
      return new LinkControl();
    },
    initialize: function(options) {
      return console.log("NavigationCompositeView", this.itemView);
    }
  });
});
