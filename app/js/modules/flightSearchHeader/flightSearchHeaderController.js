var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent", "hbs!templates/modules/flightSearchHistory/flightSearchHistoryTpl", "modules/flightSearchHistory/declaration", "localstorage"], function(Marionette, BaseBlockController, BaseComponent, FlightSearchHistoryTpl, declaration) {
  var FlightSearchHeaderController, _ref;
  return FlightSearchHeaderController = (function(_super) {
    __extends(FlightSearchHeaderController, _super);

    function FlightSearchHeaderController() {
      _ref = FlightSearchHeaderController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlightSearchHeaderController.prototype.initialize = function() {
      this.applyOptions(["region", "declaration"]);
      return this.component = new BaseComponent({
        classWrapper: 'flightSearchHeader',
        declaration: this.declaration,
        context: this,
        region: this.region,
        template: FlightSearchHistoryTpl
      });
    };

    FlightSearchHeaderController.prototype.show = function() {
      return this.component.show();
    };

    FlightSearchHeaderController.prototype.hide = function() {
      return this.region.close();
    };

    return FlightSearchHeaderController;

  })(BaseBlockController);
});
