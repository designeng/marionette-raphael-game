define(["marionette", "vent", "appinstance", "routeProcessor", "rootController"], function(Marionette, vent, App, routeProcessor, RootController) {
  var rootModule;
  return rootModule = App.module("RootModule", function(rootModule, App) {
    var rootController;
    rootController = null;
    this.startWithParent = false;
    this.passRouteConfig = function(routeConfig) {
      var pageMap;
      pageMap = routeProcessor.makePageConfig(routeConfig);
      return vent.trigger("root:pagemap:created", pageMap);
    };
    rootModule.on("before:start", function(options) {
      return routeProcessor.init(options);
    });
    rootModule.addInitializer(function(args) {
      return rootController = new RootController({
        app: App,
        module: rootModule
      });
    });
    return rootModule.addFinalizer(function() {
      if (rootController) {
        rootController.close();
        return rootController = null;
      }
    });
  });
});
