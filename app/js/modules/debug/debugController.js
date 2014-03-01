var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "when", "baseBlockController", "baseComponent", "hbs!templates/modules/debug/debugComponentTpl", "modules/debug/declaration"], function(Marionette, When, BaseBlockController, BaseComponent, DebugComponentTpl, declaration) {
  var DebugController, _ref;
  return DebugController = (function(_super) {
    __extends(DebugController, _super);

    function DebugController() {
      _ref = DebugController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DebugController.prototype.initialize = function(options) {
      this.region = Marionette.getOption(this, "region");
      return this.component = new BaseComponent({
        declaration: declaration,
        context: this,
        region: this.region,
        template: DebugComponentTpl
      });
    };

    DebugController.prototype.show = function() {
      this.component.show();
      return this.triggerMethod("show");
    };

    DebugController.prototype.hide = function() {
      return this.region.close();
    };

    DebugController.prototype.onShow = function() {
      var itemsToShow,
        _this = this;
      itemsToShow = ["flightPointNotFound", "support", "test"];
      return When(this.component.getControlByTypeName("infoControl").isResolved()).then(function(target) {
        return target.callPublic("setInfoCases", itemsToShow);
      });
    };

    return DebugController;

  })(BaseBlockController);
});
