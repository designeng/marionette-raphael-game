define(["marionette"], function(Marionette) {
  var ReportingService;
  return ReportingService = Marionette.Controller.extend({
    initialize: function() {
      var clickStream, currentStream, enterStream, resultStream,
        _this = this;
      this.context = Marionette.getOption(this, "context");
      this.eventBus = Marionette.getOption(this, "eventBus");
      this.maskService = Marionette.getOption(this, "maskService");
      this.dropDownService = Marionette.getOption(this, "dropDownService");
      _.bindAll(this, "onCurrent", "onEnter", "onClick", "report");
      this.eventBus.on("dropdownlist:current", this.onCurrent);
      this.eventBus.on("dropdownlist:click", this.onClick);
      this.eventBus.on("dropdownlist:enter", this.onEnter);
      clickStream = this.asEventStream("click");
      clickStream.onValue(function(model) {
        return _this.currentModel = model;
      });
      enterStream = this.asEventStream("enter");
      enterStream.onValue(function(model) {
        return _this.currentModel = model;
      });
      currentStream = this.asEventStream("current");
      currentStream.onValue(function(model) {
        return _this.currentModel = model;
      });
      resultStream = Bacon.mergeAll(clickStream, enterStream).toProperty();
      return resultStream.onValue(function(model) {
        _this.currentModel = model;
        return _this.report(model);
      });
    },
    onCurrent: function(model) {
      return this.trigger("current", model);
    },
    onClick: function(model) {
      return this.trigger("click", model);
    },
    onEnter: function(model) {
      return this.trigger("enter", model);
    },
    report: function(model) {
      this.returnData(model);
      this.closeSession();
      return model;
    },
    closeSession: function() {
      this.maskService.setMaskStatus("hide");
      return this.dropDownService.closeRegion();
    },
    onMaskClicked: function() {
      return this.report(this.currentModel);
    },
    returnData: function(model) {
      return this.context.trigger("option:selected", model);
    },
    getCurrentModel: function() {
      return this.currentModel;
    }
  });
});
