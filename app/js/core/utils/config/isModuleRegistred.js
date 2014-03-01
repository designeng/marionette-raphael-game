define(function() {
  var isModuleRegistred;
  return isModuleRegistred = function(moduleName) {
    var paths;
    paths = requirejs.s.contexts._.config.paths;
    return !!paths[moduleName];
  };
});
