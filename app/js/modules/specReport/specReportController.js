var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "vent", "baseBlockController", "baseComponent", "hbs!templates/modules/specReport/specReportComponentTpl", "modules/specReport/declaration"], function(Marionette, vent, BaseBlockController, BaseComponent, SpecReportComponentTpl, declaration) {
  var SpecReportController, _ref;
  return SpecReportController = (function(_super) {
    __extends(SpecReportController, _super);

    function SpecReportController() {
      this.onCollectedData = __bind(this.onCollectedData, this);
      _ref = SpecReportController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SpecReportController.prototype.initialize = function(options) {
      this.region = Marionette.getOption(this, "region");
      this.component = new BaseComponent({
        declaration: declaration,
        context: this,
        region: this.region,
        template: SpecReportComponentTpl
      });
      return this.component.show();
    };

    SpecReportController.prototype.onCollectedData = function(data) {
      return this.trigger("collected:data", {
        data: data
      });
    };

    SpecReportController.prototype.hide = function() {
      return this.region.close();
    };

    return SpecReportController;

  })(BaseBlockController);
});
