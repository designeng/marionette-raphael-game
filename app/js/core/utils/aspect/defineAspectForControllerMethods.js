var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["meld", "backbone"], function(meld, Backbone) {
  var defineAspectForControllerMethods;
  return defineAspectForControllerMethods = function(controller, shadow) {
    var actualControllerMethods, controllerProps, eventProps, method, prop, removers, targetObjectProps, _i, _len;
    eventProps = [];
    for (prop in Backbone.Events) {
      eventProps.push(prop);
    }
    targetObjectProps = [];
    for (prop in this) {
      targetObjectProps.push(prop);
    }
    controllerProps = [];
    for (prop in this.controller) {
      if (!this.controller.hasOwnProperty(prop) && __indexOf.call(shadow, prop) < 0) {
        controllerProps.push(prop);
      }
    }
    controllerProps = _.difference(controllerProps, eventProps);
    actualControllerMethods = _.intersection(controllerProps, targetObjectProps);
    removers = [];
    for (_i = 0, _len = actualControllerMethods.length; _i < _len; _i++) {
      method = actualControllerMethods[_i];
      removers.push(meld.after(this, method, this.controller[method]));
    }
    return removers;
  };
});
