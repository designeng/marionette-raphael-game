var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "routeProcessor", "_.str"], function(Marionette, routeProcessor) {
  var BaseRouter, _ref;
  BaseRouter = (function(_super) {
    __extends(BaseRouter, _super);

    function BaseRouter() {
      this.makeNewConfigRouteMethod = __bind(this.makeNewConfigRouteMethod, this);
      _ref = BaseRouter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseRouter.prototype.triggerMethod = Marionette.triggerMethod;

    BaseRouter.prototype.routeProcessor = routeProcessor;

    BaseRouter.prototype.initialize = function(options) {
      return this.processConfiguration();
    };

    BaseRouter.prototype.processConfiguration = function() {
      var route, routes, _i, _len, _results;
      this.routeConfiguration = this.routeProcessor.getRouteMap();
      routes = _.keys(this.routeConfiguration);
      _results = [];
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        _results.push(this.makeNewConfigRouteMethod(route));
      }
      return _results;
    };

    BaseRouter.prototype.makeNewConfigRouteMethod = function(route) {
      var config, method;
      method = this.toMethodName(route);
      config = this.routeConfiguration[route];
      this.controller[method] = this.initRouteMethod(route);
      return this.appRoutes[route] = method;
    };

    BaseRouter.prototype.toMethodName = function(route) {
      var f, fragments, res, _i, _len;
      fragments = this.routeProcessor.getFragments(route);
      if (fragments[0] === "!") {
        fragments.shift();
      }
      res = "do";
      if (!fragments.length) {
        return res + "Default";
      } else {
        for (_i = 0, _len = fragments.length; _i < _len; _i++) {
          f = fragments[_i];
          if (_.str.include(f, "-")) {
            f = _.str.camelize(f);
          }
          res += _.str.capitalize(f);
        }
        return res;
      }
    };

    BaseRouter.prototype.initRouteMethod = function(route) {
      var func,
        _this = this;
      func = function() {
        var param;
        param = Array.prototype.slice.call(arguments, 0);
        return _this.triggerMethod("route:config", {
          route: route,
          param: param
        });
      };
      return func;
    };

    return BaseRouter;

  })(Marionette.AppRouter);
  return BaseRouter;
});
