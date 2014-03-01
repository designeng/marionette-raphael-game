var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "when"], function(Marionette, When) {
  var ModuleHash, moduleHash, _ref;
  ModuleHash = (function(_super) {
    __extends(ModuleHash, _super);

    function ModuleHash() {
      _ref = ModuleHash.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ModuleHash.prototype.initialize = function() {
      this.moduleHash = {};
      return this.defferedObject = {};
    };

    ModuleHash.prototype.getHash = function() {
      return this.moduleHash;
    };

    ModuleHash.prototype.addModule = function(data) {
      console.log("addModule >>>", data.module);
      this.moduleHash[data.name] = data.module;
      return this.defferedObject[data.name].resolve(data.module);
    };

    ModuleHash.prototype.getModuleAsPromise = function(moduleName) {
      this.defferedObject[moduleName] = When.defer();
      return this.defferedObject[moduleName].promise;
    };

    ModuleHash.prototype.getModule = function(moduleName) {
      return this.moduleHash[moduleName];
    };

    return ModuleHash;

  })(Marionette.Controller);
  if (typeof moduleHash === "undefined" || moduleHash === null) {
    return moduleHash = new ModuleHash();
  }
});
