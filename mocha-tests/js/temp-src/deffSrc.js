define(["when"], function(WhenP) {
  var DeffSrc, def, obj;
  def = void 0;
  obj = {
    one: 1
  };
  DeffSrc = function() {
    var _this = this;
    console.log("DeffSrc");
    def = WhenP.defer();
    setTimeout(function() {
      return def.resolve(obj);
    }, 400);
    return def.promise;
  };
  return DeffSrc;
});
