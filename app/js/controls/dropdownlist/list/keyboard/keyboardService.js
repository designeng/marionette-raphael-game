define(["marionette", "_.str"], function(Marionette) {
  var KeyboardService, getMethodName, keyFunctions;
  getMethodName = function(string) {
    return "on" + _.str.classify.call(this, string);
  };
  keyFunctions = {
    onEnter: function(e) {
      this.eventBus.trigger("key:enter");
      e.preventDefault();
      return "enter";
    },
    onUp: function(e) {
      this.eventBus.trigger("key:up");
      e.preventDefault();
      return "up";
    },
    onDown: function(e) {
      this.eventBus.trigger("key:down");
      e.preventDefault();
      return "down";
    },
    onHome: function(e) {
      this.eventBus.trigger("key:home");
      e.preventDefault();
      e.stopImmediatePropagation();
      return "home";
    },
    onEnd: function(e) {
      this.eventBus.trigger("key:end");
      e.preventDefault();
      e.stopImmediatePropagation();
      return "end";
    },
    onPageUp: function(e) {
      this.eventBus.trigger("key:pageup");
      e.preventDefault();
      return "page_up";
    },
    onPageDown: function(e) {
      this.eventBus.trigger("key:pagedown");
      e.preventDefault();
      return "page_down";
    },
    onTab: function(e) {
      this.eventBus.trigger("key:tab");
      e.preventDefault();
      return "tab";
    }
  };
  return KeyboardService = Marionette.Controller.extend({
    extendWithKeyMethods: function() {
      keyFunctions.eventBus = this.eventBus;
      return _.extend(this, keyFunctions);
    },
    bindEvents: function() {
      var _this = this;
      return _.each(this.keyEvents, function(evt) {
        return _this.keyOn(evt, _this._bindKeyEventToMethod(getMethodName(evt)));
      });
    },
    unBindEvents: function() {
      var _this = this;
      return _.each(this.keyEvents, function(evt) {
        return _this.keyOff(evt);
      });
    },
    bindMethodsToEvents: function() {
      var evt, methodName, _i, _len, _ref, _removers,
        _this = this;
      _removers = [];
      _ref = this.keyEvents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        methodName = getMethodName(evt);
        if (!this[methodName]) {
          this[methodName] = function(e) {};
        }
      }
      return _removers;
    }
  });
});
