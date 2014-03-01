(function() {
  define(["backbone", "vent", "globalEvents"], function(Backbone, vent, globalEvents) {
    var ActivityRegistrator, activityRegistrator;
    ActivityRegistrator = (function() {
      function ActivityRegistrator() {
        var _this = this;
        this.channels = {};
        vent.on("mediator:history:changed", function(eData) {
          var childViewContainer, method;
          if (_this.channels["linkChannel"]) {
            method = _this.channels["linkChannel"]["relax"];
            childViewContainer = _this.channels["linkChannel"]["container"];
            return _.each(childViewContainer._views, function(view) {
              return view[method](Backbone.history.fragment);
            });
          }
        });
        globalEvents.on("html:click", function(e) {
          var childViewContainer, method;
          if (_this.channels["dropDownChannel"]) {
            method = _this.channels["dropDownChannel"]["relax"];
            childViewContainer = _this.channels["dropDownChannel"]["container"];
            return _.each(childViewContainer._views, function(view) {
              return view[method]();
            });
          }
        });
      }

      ActivityRegistrator.prototype.register = function(view, channel, methodRelax, methodBefore) {
        if (!this.channels.hasOwnProperty(channel)) {
          this.channels[channel] = {};
          this.channels[channel]["relax"] = methodRelax;
          if (methodBefore) {
            this.channels[channel]["before"] = methodBefore;
          }
          this.channels[channel]["container"] = new Backbone.ChildViewContainer();
        }
        return this.channels[channel]["container"].add(view);
      };

      ActivityRegistrator.prototype.relax = function(cid, channel) {
        var method, view;
        view = this.channels[channel]["container"].findByCid(cid);
        method = this.channels[channel]["relax"];
        return this.channels[channel]["container"].call(method, cid);
      };

      return ActivityRegistrator;

    })();
    if (typeof activityRegistrator === "undefined" || activityRegistrator === null) {
      return activityRegistrator = new ActivityRegistrator();
    }
  });

}).call(this);
