define(["marionette", "appinstance"], function(Marionette, App) {
  var BaseModule, _controller;
  _controller = null;
  return BaseModule = (function() {
    function BaseModule(options) {
      var controller, name, startWithParent;
      this.options = options || {};
      name = this.options.name;
      controller = this.options.controller;
      startWithParent = this.options.startWithParent;
      if (!name) {
        throw new Error("BaseModule needs options.name param!");
      }
      if (!controller) {
        throw new Error("Controller for BaseModule is not defined!");
      }
      this.module = this.getModule(name, this.options);
    }

    BaseModule.prototype.start = function(options) {
      return this.module.start(options);
    };

    BaseModule.prototype.addInitializer = function(options) {
      return this.module.addInitializer(options);
    };

    BaseModule.prototype.getController = function() {
      return _controller;
    };

    BaseModule.prototype.getModuleLayoutEl = function() {
      return this.module.controller.layout.$el;
    };

    BaseModule.prototype.getModuleLayout = function() {
      return this.module.controller.layout;
    };

    BaseModule.prototype.getModule = function(moduleName, options) {
      return App.module(moduleName, function(Module, App, Backbone, Marionette, $, _, _options) {
        this.startWithParent = _options.startWithParent;
        _controller = this.controller = _options.controller;
        Module.show = function() {
          return this.controller.show();
        };
        return Module.addInitializer(function(args) {
          if (args) {
            options = {
              region: args.region
            };
          } else {
            options = {};
          }
          _.extend(options, {
            app: App
          });
          if (this.controller["show"]) {
            return this.controller.show();
          }
        });
      }, options);
    };

    BaseModule.prototype.getSubmodules = function() {
      return this.module.submodules;
    };

    return BaseModule;

  })();
});
