(function() {
  define([], function() {
    var ActivityRegistrator, activityRegistrator;
    ActivityRegistrator = (function() {
      ActivityRegistrator.prototype.dropDowns = [];

      ActivityRegistrator.prototype.currentActiveDropDown = null;

      function ActivityRegistrator(options) {}

      return ActivityRegistrator;

    })();
    if (typeof activityRegistrator === "undefined" || activityRegistrator === null) {
      return activityRegistrator = new ActivityRegistrator();
    }
  });

}).call(this);
