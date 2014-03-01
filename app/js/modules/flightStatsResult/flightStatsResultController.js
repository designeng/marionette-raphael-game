var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "backbone", "vent", "baseBlockController", "baseComponent", "when", "modules/flightStatsResult/result/resultModel", "filterBaseMediator", "preloader", "utils/collection/dictionary/createDictionary", "modules/flightStatsResult/utils/createCollection", "hbs!templates/modules/flightStats/flightStatsStartPage"], function(Marionette, Backbone, vent, BaseBlockController, BaseComponent, When, ResultModel, FilterTableMediator, Preloader, createDictionary, createCollection, flightStatsStartPageTpl) {
  var FlightStatsResultController, _ref;
  return FlightStatsResultController = (function(_super) {
    __extends(FlightStatsResultController, _super);

    function FlightStatsResultController() {
      _ref = FlightStatsResultController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlightStatsResultController.prototype.initialize = function(options) {
      this.region = Marionette.getOption(this, "region");
      this.declaration = Marionette.getOption(this, "declaration");
      this.filterTableMediator = this.getFilterTableMediator();
      this.preloader = new Preloader({
        template: flightStatsStartPageTpl,
        model: new Backbone.Model({
          text: "loading..."
        })
      });
      this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region
      });
      return _.bindAll(this, "displayFlightsData", "showComponent", "exposeComponent", "showErrorMessage");
    };

    FlightStatsResultController.prototype.exposeComponent = function(data) {
      var airTrips, errors;
      this.showComponent();
      this.triggerMethod("component:exposed");
      if (_.isEmpty(data)) {
        vent.trigger("flight:stats:data:empty");
        return this.displayResultStatus("flightPointNotFound");
      } else {
        errors = data.properties.errors;
        if (errors.length === 0) {
          airTrips = data.data.flightStates[0].airTrips;
          if (airTrips.length) {
            return this.displayFlightsData(data);
          } else {
            return this.displayResultStatus("flightsNotFoundGotoSchedule");
          }
        } else {
          return this.showErrorMessage(errors[0]);
        }
      }
    };

    FlightStatsResultController.prototype.onComponentExposed = function() {
      this.infoStateItem = this.component.getControlByTypeName("infoControl");
      return this.infoStateItem.hide();
    };

    FlightStatsResultController.prototype.getFilterTableMediator = function() {
      var filterTableMediator;
      return filterTableMediator = new FilterTableMediator;
    };

    FlightStatsResultController.prototype.show = function() {
      return this.region.show(this.preloader);
    };

    FlightStatsResultController.prototype.showComponent = function() {
      return this.component.show();
    };

    FlightStatsResultController.prototype.displayFlightsData = function(data) {
      var airportArrivalName, airportDepartureName,
        _this = this;
      this.dictionary = this.setDictionaries(data);
      this.tableCollection = createCollection.call(data, this.dictionary);
      console.log(this.tableCollection);
      airportDepartureName = this.tableCollection.at(0).get("airportDepartureName");
      airportArrivalName = this.tableCollection.at(0).get("airportArrivalName");
      When(this.component.getControlByTypeName("tableControl").isResolved()).then(function(target) {
        target.callPublic("exposeCollection", _this.tableCollection);
        console.log(_this.tableCollection);
        _this.filterTableMediator.setTableCollection(_this.tableCollection);
        return _this.filterTableMediator.trigger("tableCollection:change");
      });
      return When(this.component.getControlByTypeName("simpleTplControl").isResolved()).then(function(target) {
        target.callPublic("setTemplateField", "fromField", airportDepartureName);
        return target.callPublic("setTemplateField", "toField", airportArrivalName);
      });
    };

    FlightStatsResultController.prototype.displayResultStatus = function(status) {
      var _this = this;
      console.log(status);
      this.infoStateItem.show();
      return When(this.component.getControlByTypeName("infoControl").isResolved()).then(function(target) {
        return target.callPublic("setInfoCases", status);
      });
    };

    FlightStatsResultController.prototype.setDictionaries = function(data) {
      return createDictionary(["AIRPORT", "AIRCOMPANY", "AIRPLANE", "CITY", "FLIGHT_STATE"], data);
    };

    FlightStatsResultController.prototype.showErrorMessage = function(err) {};

    return FlightStatsResultController;

  })(BaseBlockController);
});
