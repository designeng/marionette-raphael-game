define(["backbone", "marionette"], function(Backbone, Marionette) {
  var MaskService, MaskView;
  MaskView = Marionette.ItemView.extend({
    className: "maskServiceView",
    events: {
      "mousemove": "hideMask"
    },
    initialize: function() {
      return this.eventBus = Marionette.getOption(this, "eventBus");
    },
    setMaskWidth: function(width) {
      return this.$el.css("width", width);
    },
    setMaskHeight: function(height) {
      return this.$el.css("height", height);
    },
    getMaskHeight: function() {
      return this.$el.css("height");
    },
    setMaskStatus: function(status) {
      if (status === "hide") {
        this.status = "hidden";
      } else if (status === "show") {
        this.status = "shown";
      }
      if (status === "show") {
        return this.$el.show();
      } else if (status === "hide") {
        return this.$el.hide();
      }
    },
    hideMask: function(event) {
      var absDiff, distance, startingLeft, startingTop,
        _this = this;
      startingTop = 0;
      startingLeft = 0;
      distance = Math.round(Math.sqrt(Math.pow(startingTop - event.clientY, 2) + Math.pow(startingLeft - event.clientX, 2)));
      if (!this._lastDistance) {
        this._lastDistance = distance;
      }
      absDiff = Math.abs(this._lastDistance - distance);
      this._lastDistance = distance;
      if ((3 > absDiff && absDiff > 0) && absDiff !== 0) {
        return setTimeout(function() {
          return _this.setMaskStatus("hide");
        }, 0);
      }
    },
    getStatus: function() {
      return this.status;
    }
  });
  MaskService = Marionette.Controller.extend({
    initialize: function() {
      return this.maskView = new MaskView({
        eventBus: Marionette.getOption(this, "eventBus")
      });
    },
    renderInRegion: function(region) {
      return region.show(this.maskView);
    },
    setMaskStatus: function(status) {
      return this.maskView.setMaskStatus(status);
    },
    getMaskStatus: function() {
      return this.maskView.getStatus();
    },
    setMaskWidth: function(width) {
      return this.maskView.setMaskWidth(width);
    },
    setMaskHeight: function(height) {
      return this.maskView.setMaskHeight(height);
    },
    getMaskHeight: function() {
      return this.maskView.getMaskHeight();
    },
    getMaskView: function() {
      return this.maskView;
    }
  });
  return MaskService;
});
