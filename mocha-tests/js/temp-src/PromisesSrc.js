define(["when"], function(WhenP) {
  var PromisesSrc, WhenAll;
  WhenAll = WhenP.all;
  PromisesSrc = function() {
    var def1, def2, defereds;
    defereds = [];
    def1 = WhenP.defer();
    defereds.push(def1.promise);
    def2 = WhenP.defer();
    defereds.push(def2.promise);
    setTimeout(function() {
      return def1.resolve("test1");
    }, 3000);
    setTimeout(function() {
      return def2.resolve("test2");
    }, 4000);
    return WhenAll(defereds);
  };
  return PromisesSrc;
});
