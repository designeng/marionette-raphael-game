define(["marionette", "buttonControl", "buttonModel"], function(Marionette, ButtonControl, ButtonModel) {
  var BoxControlView;
  return BoxControlView = Marionette.Layout.extend({
    template: "{{text}}<div class='streamDetector'>closeButton</div><span></span>",
    className: function() {
      return this.defaultClassName("box");
    },
    events: {
      "click": "onClick"
    },
    initialize: function(options) {
      var _this = this;
      this.context = Marionette.getOption(this, "context");
      this.model.on("change", function(model) {
        console.log("CHANGED", model);
        return _this.$el.html(model.get("text"));
      });
      _.bindAll(this, "onCollectedData");
      return this.context.on("collected:data", this.onCollectedData);
    },
    onCollectedData: function(evtData) {
      var item, text, _i, _len, _ref;
      if (evtData.data.data) {
        text = "";
        _ref = evtData.data.data;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          text += item.name + " - " + item.data + "<br>";
        }
        return this.model.set("text", text);
      }
    },
    onRender: function() {},
    onClose: function() {}
  });
});
