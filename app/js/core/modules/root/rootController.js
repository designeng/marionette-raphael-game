define(["marionette", "rootRouter"], function(Marionette, RootRouter) {
  var RootController;
  return RootController = Marionette.Controller.extend({
    initialize: function(options) {
      this.module = Marionette.getOption(this, "module");
      this.module.router = new RootRouter({
        context: this.module
      });
      return this.module.router.bind("all", function(route, router) {});
    }
  });
});
