define(["backbone", "marionette", "Handlebars", "appinstance", "vent", "rootModule", "pageModule", "handlebarsHelpers", "overridden", "extended"], function(Backbone, Marionette, Handlebars, App, vent, rootModule, PageModule) {
  var ApplicationRegion;
  App.on("initialize:before", function(options) {
    return rootModule.start(options);
  });
  App.on("initialize:after", function() {
    Backbone.history.start();
    return Backbone.history.bind("all", function(route, router) {
      return vent.trigger("history:changed", {
        hash: window.location.hash
      });
    });
  });
  App.addInitializer(function() {
    var pageModule;
    pageModule = new PageModule({
      region: App.application
    });
    return pageModule.start();
  });
  ApplicationRegion = Marionette.Region.extend({
    el: "#application",
    onShow: function() {
      return vent.trigger("appregion:showed");
    }
  });
  App.addRegions({
    application: ApplicationRegion
  });
  App.addRegions({
    debug: "#debug"
  });
  App.addRegions({
    debugMore: "#debug-more"
  });
  return App;
});
