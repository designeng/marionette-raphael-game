var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "vent", "baseBlockController", "baseComponent", "hbs!templates/modules/debugConsole/debugConsoleComponentTpl", "modules/debugConsole/declaration"], function(Marionette, vent, BaseBlockController, BaseComponent, DebugConsoleComponentTpl, declaration) {
  var DebugConsoleController, _ref;
  return DebugConsoleController = (function(_super) {
    __extends(DebugConsoleController, _super);

    function DebugConsoleController() {
      this.onCollectedData = __bind(this.onCollectedData, this);
      _ref = DebugConsoleController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DebugConsoleController.prototype.initialize = function(options) {
      this.region = Marionette.getOption(this, "region");
      this.component = new BaseComponent({
        declaration: declaration,
        context: this,
        region: this.region,
        template: DebugConsoleComponentTpl
      });
      return vent.on("mediator:collected:data", this.onCollectedData);
    };

    DebugConsoleController.prototype.onCollectedData = function(data) {
      return this.trigger("collected:data", {
        data: data
      });
    };

    DebugConsoleController.prototype.show = function() {
      return this.component.show();
    };

    DebugConsoleController.prototype.hide = function() {
      return this.region.close();
    };

    return DebugConsoleController;

  })(BaseBlockController);
});
