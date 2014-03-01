var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["vent", "when", "moduleHash"], function(vent, When, moduleHash) {
  var Mediator, mediator;
  Mediator = (function() {
    function Mediator() {
      this.onHistoryChanged = __bind(this.onHistoryChanged, this);
      this.onRouteConfigComplited = __bind(this.onRouteConfigComplited, this);
      this.onSearchStartDateSetting = __bind(this.onSearchStartDateSetting, this);
      this.onFlightSearchResult = __bind(this.onFlightSearchResult, this);
      this.hash = moduleHash.getHash();
      vent.on("root:pagemap:created", this.onRouteConfigComplited);
      vent.on("history:changed", this.onHistoryChanged);
      vent.on("flight:search:result", this.onFlightSearchResult);
    }

    Mediator.prototype.onFlightSearchResult = function(evtData, moduleName) {
      return this.hash[moduleName].exposeComponent(evtData);
    };

    Mediator.prototype.onSearchStartDateSetting = function(dateStr, moduleName) {
      this.hash[moduleName].setDate(dateStr);
      return this.hash[moduleName].commitFormData();
    };

    Mediator.prototype.onRouteConfigComplited = function(pageMap) {
      return vent.trigger("display:modules", pageMap);
    };

    Mediator.prototype.onHistoryChanged = function(evtData) {};

    return Mediator;

  })();
  return mediator = new Mediator();
});
