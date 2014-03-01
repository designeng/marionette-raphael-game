define(["underscore", "backbone", "marionette"], function(_, Backbone, Marionette) {
  var resolve, resolveClass, resolveClassInstance, resolveControl, resolveControlInstance, resolver;
  resolveClass = function(name, callback) {
    var i, len, obj, parts;
    if (_.isFunction(name)) {
      return callback(name);
    } else if (_.isString(name)) {
      parts = void 0;
      i = void 0;
      len = void 0;
      obj = void 0;
      parts = name.split(".");
      i = 0;
      len = parts.length;
      obj = window;
      while (i < len) {
        obj = obj[parts[i]];
        ++i;
      }
      if (obj) {
        return callback(obj);
      } else {
        if (typeof require !== "undefined") {
          return require([name], callback);
        }
      }
    }
    throw new Error("Cannot resolve class \"" + name + "\"");
  };
  resolveClassInstance = function(classObject, options) {
    var instance;
    instance = new classObject(options);
    return instance;
  };
  resolve = function(classType, resolve, reject, callback) {
    var e, resultClass,
      _this = this;
    try {
      resultClass = require(classType);
      resolve(classType);
      return callback(classType);
    } catch (_error) {
      e = _error;
      if (e.requireType === "notloaded") {
        return require([classType], function(classTypeView) {
          resolve(classType);
          return callback(classTypeView);
        });
      }
    }
  };
  resolveControl = resolveClass;
  resolveControlInstance = resolveClassInstance;
  return resolver = {
    resolveClass: resolveClass,
    resolveClassInstance: resolveClassInstance,
    resolveControl: resolveControl,
    resolveControlInstance: resolveControlInstance,
    resolve: resolve
  };
});
