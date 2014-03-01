define(["backbone", "marionette", "baseControl", "when"], function(Backbone, Marionette, BaseControl, When) {
  var ButtonView;
  return ButtonView = BaseControl.extend({
    tagName: "input",
    className: function() {
      return this.defaultClassName("button");
    },
    events: {
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut",
      "click": "onClick",
      "focus": "onFocus",
      "blur": "onBlur"
    },
    modelEvents: {
      "change:disabled": "onDisabledChange"
    },
    initialize: function(options) {
      this.context = Marionette.getOption(this, "context");
      this.applyModelProperties(["states", "callback", "timeout", "caption", "triggerEvent"], {
        prefix: this._attrPrefix
      });
      if (this.context && this.context["validate"]) {
        _.result(this.context["validate"]);
      }
      if (this.model.get("disabled")) {
        this.disabled = true;
        this.$el.addClass(this._states["disabled"]["className"]);
        this.$el.attr("disabled", "disabled");
      }
      return this.$el.attr("type", "button");
    },
    onRender: function() {
      this._captionPrepared = this.prepareLocalized(this._caption, "string");
      if (_.isArray(this._captionPrepared)) {
        this._captionPrepared = this._captionPrepared[0];
      }
      return this.$el.attr("value", this._captionPrepared);
    },
    onFocus: function() {
      return this.$el.addClass('focus');
    },
    onBlur: function() {
      return this.$el.removeClass('focus');
    },
    onDisabledChange: function() {
      this.disabled = !this.disabled;
      if (!this.disabled) {
        this.$el.removeClass(this._states["disabled"]["className"]);
        return this.$el.removeAttr("disabled", "disabled");
      } else {
        this.$el.addClass(this._states["disabled"]["className"]);
        return this.$el.attr("disabled", "disabled");
      }
    },
    setActive: function(state) {
      if (!state) {
        return this.model.set("disabled", true);
      } else if (!!state === true) {
        return this.model.set("disabled", false);
      }
    },
    onMouseOver: function(event) {
      if (this.disabled) {
        return;
      }
      return this.$el.addClass(this._states["hover"]["className"]);
    },
    onMouseOut: function(event) {
      var state, _i, _len, _ref, _results;
      if (this.disabled) {
        return;
      }
      _ref = ["hover", "active"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        _results.push(this.$el.removeClass(this._states[state]["className"]));
      }
      return _results;
    },
    onClick: function(e) {
      if (this.disabled) {
        e.preventDefault();
        return;
      } else {
        this.setActive(false);
        if (this._triggerEvent) {
          this.context.trigger(this._triggerEvent);
        }
        if (this._callback) {
          _.result(this, "callback");
          e.preventDefault();
          return;
        }
      }
      return e.preventDefault();
    },
    publicApi: function() {
      return {
        "setActive": this.setActive
      };
    }
  });
});
