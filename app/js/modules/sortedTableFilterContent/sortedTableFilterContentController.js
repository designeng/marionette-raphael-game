define(["marionette", "baseComponent"], function(Marionette, BaseComponent) {
  var sortedTableFilterContentController;
  return sortedTableFilterContentController = Marionette.Controller.extend({
    initialize: function(options) {
      this.region = Marionette.getOption(this, "region");
      this.declaration = Marionette.getOption(this, "declaration");
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region
      });
    },
    show: function() {
      this.component.show();
      return this.triggerMethod("show");
    },
    close: function() {
      return this.component.close();
    }
  });
});
