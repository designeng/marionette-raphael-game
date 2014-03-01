define(["meld", "backbone"], function(meld, Backbone) {
  var defineCommonAspect;
  return defineCommonAspect = function(method, aspectMethod, aspectBehavior) {
    var asp;
    asp = meld[aspectBehavior](this, method, this[aspectMethod]);
    return asp;
  };
});
