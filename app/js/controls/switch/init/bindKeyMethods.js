define(function() {
  var bindKeyMethods, keyFunctions;
  keyFunctions = {
    onSpace: function(e) {
      return "space";
    },
    onLeft: function(e) {
      return "left";
    },
    onRight: function(e) {
      return "right";
    },
    onUp: function(e) {
      return "up";
    },
    onDown: function(e) {
      return "down";
    },
    onTab: function(e) {
      return "tab";
    }
  };
  bindKeyMethods = function(keyEvents) {
    return _.extend(this, keyFunctions);
  };
  return bindKeyMethods;
});
