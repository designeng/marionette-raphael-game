define(["backbone", "marionette", "baseControl", "controlContainerService", "hintControl", "inputError"], function(Backbone, Marionette, BaseControl, controlContainerService, HintControl, InputErrorControl) {
  var BaseInput;
  BaseInput = BaseControl.extend({
    className: function() {
      return this.defaultClassName("inputControl");
    },
    initialize: function(options) {
      var hintModel;
      if (hintModel = this.model.get("hint")) {
        this.hint = new HintControl({
          model: hintModel
        });
      }
      if (this.model.has("inputErrorHandlerCid")) {
        return this.inputError = controlContainerService.findByCid(this.model.get("inputErrorHandlerCid"));
      } else {
        return this.inputError = new InputErrorControl({
          model: new Backbone.Model()
        });
      }
    },
    beforeBaseInputRender: function() {
      return this.model.set("isValid", true);
    },
    afterBaseInputRender: function() {
      var prop, _i, _len, _ref, _results;
      _ref = ["width", "height", "fontSize"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        if (this.model.has(prop)) {
          _results.push(this.$el.find("input").css(prop, this.pixelize(this.model.get(prop))));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    pixelize: function(width) {
      return width + "px";
    }
  });
  return BaseInput;
});
