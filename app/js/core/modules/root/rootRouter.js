var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["baseRouter"], function(BaseRouter) {
  var RootRouter, _ref;
  return RootRouter = (function(_super) {
    __extends(RootRouter, _super);

    function RootRouter() {
      _ref = RootRouter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RootRouter.prototype.controller = {
      onRuLocale: function() {
        console.log("ru");
        return this.navigateToLocale("ru");
      },
      onEnLocale: function() {
        return this.navigateToLocale("en");
      },
      onDeLocale: function() {
        return this.navigateToLocale("de");
      },
      onEsLocale: function() {
        return this.navigateToLocale("es");
      },
      onLvLocale: function() {
        return this.navigateToLocale("lv");
      },
      navigateToLocale: function(loc) {
        return console.log("switched to locale: " + loc);
      }
    };

    RootRouter.prototype.appRoutes = {
      "!/ru": "onRuLocale",
      "!/en": "onEnLocale",
      "!/de": "onDeLocale",
      "!/es": "onEsLocale",
      "!/lv": "onLvLocale"
    };

    RootRouter.prototype.initialize = function(options) {
      options = options || {};
      this.context = options.context;
      return RootRouter.__super__.initialize.call(this, options);
    };

    RootRouter.prototype.onRouteConfig = function(routeConfig) {
      return this.context.passRouteConfig(routeConfig);
    };

    return RootRouter;

  })(BaseRouter);
});
