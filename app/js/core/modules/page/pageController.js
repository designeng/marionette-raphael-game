define(["marionette", "when", "pageLayout", "regionModuleRegistrator"], function(Marionette, When, Layout, RegionModuleRegistrator) {
  var PageController;
  return PageController = Marionette.Controller.extend({
    initialize: function(options) {
      this.region = Marionette.getOption(this, "region");
      return this.regionModuleRegistrator = new RegionModuleRegistrator();
    },
    show: function() {
      this.layout = new Layout({
        model: new Backbone.Model()
      });
      return this.region.show(this.layout);
    },
    hide: function() {
      return this.region.close();
    },
    displayModules: function(evtData) {
      var param,
        _this = this;
      this.pageMap = evtData.map;
      param = evtData.param;
      console.log("displayModules", this.pageMap);
      return When(this.regionModuleRegistrator.registerPageConfig(this.pageMap)).then(function(pageStructure) {
        return _this.runDisplayProcess(pageStructure);
      });
    },
    runDisplayProcess: function(pageStructure) {
      return this.layout.processPageStructure(pageStructure);
    },
    getPageMap: function() {
      return this.pageMap;
    }
  });
});
