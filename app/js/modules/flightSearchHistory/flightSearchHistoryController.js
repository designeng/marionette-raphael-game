var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent", "hbs!templates/modules/flightSearchHistory/flightSearchHistoryTpl", "modules/flightSearchHistory/declaration", "localstorage"], function(Marionette, BaseBlockController, BaseComponent, FlightSearchHistoryTpl, declaration) {
  var FlightSearchHistoryController, _ref;
  return FlightSearchHistoryController = (function(_super) {
    __extends(FlightSearchHistoryController, _super);

    function FlightSearchHistoryController() {
      _ref = FlightSearchHistoryController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlightSearchHistoryController.prototype.initialize = function() {
      this.applyOptions(["region", "declaration"]);
      return this.component = new BaseComponent({
        classWrapper: 'flightSearchHistory',
        declaration: this.declaration,
        context: this,
        region: this.region,
        template: FlightSearchHistoryTpl
      });
    };

    FlightSearchHistoryController.prototype.show = function() {
      return this.component.show();
    };

    FlightSearchHistoryController.prototype.hide = function() {
      return this.region.close();
    };

    return FlightSearchHistoryController;

  })(BaseBlockController);
});
