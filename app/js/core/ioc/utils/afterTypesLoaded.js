define(["resolver", "when"], function(resolver, When) {
  var afterTypesLoaded;
  return afterTypesLoaded = function(types, callback, errback) {
    var promise, promises, type, _i, _len;
    promises = [];
    for (_i = 0, _len = types.length; _i < _len; _i++) {
      type = types[_i];
      promise = When.promise(function(resolve, reject, notify) {
        return resolver.resolve(type, resolve, reject, function(classType) {});
      });
      promises.push(promise);
    }
    return When.all(promises).then(callback, errback);
  };
});
