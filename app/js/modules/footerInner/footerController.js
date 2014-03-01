define(["marionette", "baseComponent", "hbs!templates/modules/footer/footerComponentTpl"], function(Marionette, BaseComponent, FooterComponentTpl) {
  var FooterController;
  return FooterController = Marionette.Controller.extend({
    initialize: function(options) {
      this.applyOptions(["region", "declaration"]);
      return this.footerNavigation = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region,
        template: FooterComponentTpl
      });
    },
    show: function() {
      return this.footerNavigation.show();
    },
    hide: function() {
      return this.region.close();
    },
    displayModules: function() {
      return false;
    }
  });
});
