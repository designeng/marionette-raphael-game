define(["vent", "resolver", "when", "core/ioc/utils/getActualTypes", "core/ioc/utils/afterTypesLoaded", "core/utils/config/isModuleRegistred"], function(vent, resolver, When, getActualTypes, afterTypesLoaded, isModuleRegistred) {
  var startComponentInRegion;
  return startComponentInRegion = function(name, region) {
    var defered,
      _this = this;
    defered = When.defer();
    if (!isModuleRegistred(name)) {
      defered.reject(name);
    } else {
      require([name], function(ModuleClass) {
        return require(["text!modules/" + name + "/declaration.js", "modules/" + name + "/declaration"], function(declarationAsText, declaration) {
          var callback, errback, types;
          types = getActualTypes(declarationAsText);
          callback = function(res) {
            _this.module = new ModuleClass({
              region: region,
              declaration: declaration,
              context: _this
            });
            defered.resolve({
              name: name,
              module: _this.module
            });
            if (_this.module["show"]) {
              return _this.module.show();
            }
          };
          errback = function(err) {
            return console.log("ERROR", err);
          };
          return afterTypesLoaded(types, callback, errback);
        });
      });
    }
    return defered.promise;
  };
});
