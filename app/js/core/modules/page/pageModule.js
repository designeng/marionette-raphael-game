define(["marionette", "vent", "meld", "baseModule", "pageController"], function(Marionette, vent, meld, BaseModule, PageController) {
  var PageModule;
  return PageModule = (function() {
    function PageModule(options) {
      this.module = new BaseModule({
        name: "pageModule",
        controller: new PageController({
          region: options.region
        }),
        startWithParent: false
      });
      this.initListeners();
    }

    PageModule.prototype.start = function() {
      return this.module.start();
    };

    PageModule.prototype.initListeners = function() {
      var _this = this;
      return vent.on("display:modules", function(evtData) {
        return _this.module.getController().displayModules(evtData);
      });
    };

    return PageModule;

  })();
});
