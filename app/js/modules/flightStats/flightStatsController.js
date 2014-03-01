var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "marionette", "vent", "when", "moment", "superagent", "baseBlockController", "baseComponent", "modules/flightStats/data/model/autocomplete/flightModel", "modules/flightStats/data/model/textinput/flightNumberModel", "controlContainerService", "modules/flightStats/utils/filterData", "modules/flightStats/utils/isCoincidence", "modules/flightStats/utils/cleanData", "utils/date/isValidDate"], function(Backbone, Marionette, vent, When, moment, request, BaseBlockController, BaseComponent, FlightModel, FlightNumberModel, controlContainerService, filterData, isCoincidence, cleanData, isValidDate) {
  var FlightStatsController, _ref;
  return FlightStatsController = (function(_super) {
    __extends(FlightStatsController, _super);

    function FlightStatsController() {
      _ref = FlightStatsController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlightStatsController.prototype.flightStatesSearchRequest = {};

    FlightStatsController.prototype.initialize = function(options) {
      var _this = this;
      this.moduleToExposeResults = "flightStatsResult";
      if (!this.method) {
        this.method = "POST";
      }
      if (!this.dataModel) {
        this.dataModel = new Backbone.Model();
      }
      if (!this.collection) {
        this.collection = new Backbone.Collection();
      }
      this.region = Marionette.getOption(this, "region");
      this.declaration = Marionette.getOption(this, "declaration");
      this.addValidationPattern();
      this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region
      });
      _.bindAll(this, "onSwitchSelected", "onItemAdded", "onControlRendered", "onCollectData", "onFlightStatsProcessData", "onFocusNext", "getStartDate");
      this.on("switch:selected", this.onSwitchSelected);
      this.on("component:collection:item:added", this.onItemAdded);
      this.on("component:control:rendered", this.onControlRendered);
      this.on("collect:data", this.onCollectData);
      this.on("flightstats:process:data", this.onFlightStatsProcessData);
      this.on("focus:next", this.onFocusNext);
      this.flightStatesSearchRequest.applicationId = "4352345343";
      this.flightStatesSearchRequest.segments = [];
      this.startDateStream = this.asEventStream("startdate:changed").map(this.getStartDate);
      this.startDateStream.onValue(function(startDate) {
        return When(_this.flightStatesSearchRequest.segments[0]).then(function(target) {
          return target.startDate = startDate;
        });
      });
      this.setDate("now");
      return this.initSegment(0);
    };

    FlightStatsController.prototype.addValidationPattern = function() {
      return _.extend(Backbone.Validation.patterns, {
        flightNumber: /^\s*(([a-zA-Zа-яА-Я]{1}[0-9]{1})|([0-9]{1}[a-zA-Zа-яА-Я]{1})|([a-zA-Zа-яА-Я]{2})){1}\s*([0-9]{1,4})\s*$/
      });
    };

    FlightStatsController.prototype.onFlightStatsProcessData = function() {
      var segment;
      segment = this.getSegment(0);
      if (!segment["flightNumber"] && (!segment["startPoint"] || !segment["endPoint"])) {
        this.showMessage(this.prepareLocalized("loc_NotBlankMessage", "string"));
        this.activateButton();
        return;
      }
      if (!isCoincidence(segment)) {
        this.hideMessage();
        return this.sendAjax();
      } else {
        this.showMessage(this.prepareLocalized("loc_info.booking.variant.cityDuplication", "string"));
        return this.activateButton();
      }
    };

    FlightStatsController.prototype.onItemAdded = function(item) {};

    FlightStatsController.prototype.onControlRendered = function(controlItem) {
      if (this.inputErrorHandlerCid === controlItem.cid) {
        return this.errorHandlerControl = controlItem;
      }
    };

    FlightStatsController.prototype.initSegment = function(index) {
      if (!this.flightStatesSearchRequest.segments[index]) {
        return this.flightStatesSearchRequest.segments[index] = {
          startDate: this.startDate
        };
      }
    };

    FlightStatsController.prototype.getSegment = function(index) {
      return this.flightStatesSearchRequest.segments[index];
    };

    FlightStatsController.prototype.getErrorHandlerControl = function() {
      return this.errorHandlerControl;
    };

    FlightStatsController.prototype.getItemByIndex = function(index) {
      return this.component.getControlByIndex(index);
    };

    FlightStatsController.prototype.setComponentRegion = function(region) {
      return this.component.region = region;
    };

    FlightStatsController.prototype.onSwitchSelected = function(switchOption) {
      if (switchOption === "Route") {
        return this.routeRule();
      } else if (switchOption === "FlightNumber") {
        return this.flightNumberRule();
      }
    };

    FlightStatsController.prototype.showMessage = function(errorMsg) {
      return this.errorHandlerControl.show(errorMsg);
    };

    FlightStatsController.prototype.hideMessage = function() {
      if (this.errorHandlerControl) {
        return this.errorHandlerControl.hide();
      }
    };

    FlightStatsController.prototype.show = function() {
      this.component.show();
      return this.triggerMethod("show");
    };

    FlightStatsController.prototype.onShow = function() {
      this.itemFlightNumber = this.getItemByIndex(1);
      this.itemFlightFrom = this.getItemByIndex(2);
      this.itemFlightTo = this.getItemByIndex(3);
      return this.forceFormFillingAndSearch();
    };

    FlightStatsController.prototype.routeRule = function() {
      this.itemFlightNumber.hide();
      this.itemFlightFrom.show();
      this.itemFlightTo.show();
      this.hideMessage();
      return cleanData(this.getSegment(0), "flightNumber");
    };

    FlightStatsController.prototype.flightNumberRule = function() {
      this.itemFlightNumber.show();
      this.itemFlightFrom.hide();
      this.itemFlightTo.hide();
      this.hideMessage();
      return cleanData(this.getSegment(0), ["startPoint", "endPoint"]);
    };

    FlightStatsController.prototype.close = function() {
      return this.component.close();
    };

    FlightStatsController.prototype.onCollectData = function(model) {
      var inputName, param, validationModel;
      inputName = model.get("inputName");
      if (inputName === "flightFrom" || inputName === "flightTo") {
        validationModel = new FlightModel({
          id: parseInt(model.get("id")),
          type: model.get("type")
        });
        param = ["id", "type"];
      } else if (inputName === "flightNumber") {
        validationModel = new FlightNumberModel({
          flightNumber: model.get("flightNumber")
        });
        param = "flightNumber";
      }
      if (validationModel && validationModel.isValid(param)) {
        return this.collectData(model);
      }
    };

    FlightStatsController.prototype.collectData = function(model) {
      var segmentBit;
      this.collection.add(model, {
        merge: true
      });
      segmentBit = filterData(model);
      return this.updateFlightStatesSearchRequestSegments(0, segmentBit);
    };

    FlightStatsController.prototype.updateFlightStatesSearchRequestSegments = function(index, obj) {
      return this.flightStatesSearchRequest.segments[index] = _.extend(this.flightStatesSearchRequest.segments[index], obj);
    };

    FlightStatsController.prototype.sendAjax = function() {
      var _this = this;
      return request.post(this.action).send(this.flightStatesSearchRequest).set("Accept", "application/json").end(function(res) {
        if (res.ok) {
          vent.trigger("flight:search:result", res.body, _this.moduleToExposeResults);
          return _this.activateButton();
        } else {
          return console.log("ERROR " + res.text);
        }
      });
    };

    FlightStatsController.prototype.activateButton = function() {
      var _this = this;
      return When(this.component.getControlByTypeName("buttonControl").isResolved()).then(function(target) {
        return target.callPublic("setActive", true);
      });
    };

    FlightStatsController.prototype.onFocusNext = function() {
      return $(':focus').focusNextInputField();
    };

    FlightStatsController.prototype.setDate = function(date) {
      if (!_.isString(date)) {
        console.log("Date is not string!");
        return;
      }
      if ((date !== "yesterday" && date !== "now" && date !== "tomorrow") && !isValidDate(date)) {
        console.log("Date is not valid!");
        return;
      }
      switch (date) {
        case "yesterday":
          return this.setStartDate(moment().add('days', -1).format("YYYY-MM-DD"));
        case "tomorrow":
          return this.setStartDate(moment().add('days', 1).format("YYYY-MM-DD"));
        case "now":
          return this.setStartDate(moment().format("YYYY-MM-DD"));
        default:
          return this.setStartDate(date);
      }
    };

    FlightStatsController.prototype.setStartDate = function(date) {
      this.startDate = date;
      return this.trigger("startdate:changed");
    };

    FlightStatsController.prototype.getStartDate = function() {
      return this.startDate;
    };

    FlightStatsController.prototype.commitFormData = function() {
      return $(".flightStats input.buttonControl").click();
    };

    FlightStatsController.prototype.forceFormFillingAndSearch = function() {
      var _this = this;
      When(this.itemFlightFrom.isResolved()).then(function(target) {
        return target.callPublic("dropDownSelectedImitation", {
          model: new Backbone.Model({
            codeIata: "MOW",
            codeSirena: "МОВ",
            countryName: "Роccия",
            id: "1",
            inputName: "flightFrom",
            itemClassName: "flightPointItem",
            itemHeight: 25,
            itemStringLength: 40,
            modelIndex: 0,
            name: "Москва",
            type: "CITY"
          })
        });
      });
      return When(this.itemFlightTo.isResolved()).then(function(target) {
        target.callPublic("dropDownSelectedImitation", {
          model: new Backbone.Model({
            codeIata: "PAR",
            codeSirena: "ПАЖ",
            countryName: "Франция",
            id: "1995",
            inputName: "flightTo",
            itemClassName: "flightPointItem",
            itemHeight: 25,
            itemStringLength: 41,
            modelIndex: 4,
            name: "Париж",
            type: "CITY"
          })
        });
        return _this.commitFormData();
      });
    };

    return FlightStatsController;

  })(BaseBlockController);
});
