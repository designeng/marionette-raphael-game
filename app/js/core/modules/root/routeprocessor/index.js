var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["backbone", "vent"], function(Backbone, vent) {
  var ROOT_ROUTE, RouteCollection, RouteModel, RouteProcessor, routeProcessor;
  ROOT_ROUTE = "!/";
  RouteModel = Backbone.Model.extend({
    defaults: {
      route: ROOT_ROUTE,
      prev: null,
      cur: "!",
      map: {},
      level: 0,
      next: null
    }
  });
  RouteCollection = Backbone.Collection.extend();
  RouteProcessor = (function() {
    function RouteProcessor() {
      this.makePageConfig = __bind(this.makePageConfig, this);
    }

    RouteProcessor.prototype.instance = void 0;

    RouteProcessor.prototype.collection = new RouteCollection;

    RouteProcessor.prototype.init = function(options) {
      if (options.routeMap) {
        this.routeMap = options.routeMap;
      }
      return this.processRouteMap(this.routeMap);
    };

    RouteProcessor.prototype.setRouteMap = function(rm) {
      return this.routeMap = rm;
    };

    RouteProcessor.prototype.getRouteMap = function() {
      return this.routeMap;
    };

    RouteProcessor.prototype.getCollection = function() {
      return this.collection;
    };

    RouteProcessor.prototype.processRouteMap = function(rm) {
      var rModel, rootRoute, rootRouteModel, route, _results;
      rootRoute = rm[ROOT_ROUTE];
      if (!rootRoute) {
        throw new Error("rootRoute does not defined in routeMap!");
      }
      rootRouteModel = new RouteModel({
        map: rm[ROOT_ROUTE]
      });
      this.collection.add(rootRouteModel);
      _results = [];
      for (route in rm) {
        if (route === ROOT_ROUTE) {
          continue;
        }
        rModel = this.createRouteModel(rm, route, rm[route]);
        _results.push(this.collection.add(rModel));
      }
      return _results;
    };

    RouteProcessor.prototype.createRouteModel = function(rm, route, config) {
      var cur, fragments, level, prev, rModel;
      fragments = this.getFragments(route);
      level = this.getRouteLevel(fragments);
      prev = fragments[level - 1];
      cur = fragments[level];
      rModel = new RouteModel({
        route: route,
        map: rm[route],
        level: level,
        prev: prev,
        cur: cur
      });
      return rModel;
    };

    RouteProcessor.prototype.getFragments = function(route) {
      var fragments, p, parts, _i, _len;
      fragments = [];
      parts = route.split("/");
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        p = parts[_i];
        if (p !== "") {
          fragments.push(p);
        }
      }
      return fragments;
    };

    RouteProcessor.prototype.getRouteLevel = function(fragments) {
      return fragments.length - 1;
    };

    RouteProcessor.prototype.makePageConfig = function(evtData) {
      var frag, fragments, map, model, route, _i, _len;
      map = {};
      route = evtData.route;
      fragments = this.getFragments(route);
      for (_i = 0, _len = fragments.length; _i < _len; _i++) {
        frag = fragments[_i];
        model = (this.collection.where({
          cur: frag
        }))[0];
        _.extend(map, model.get("map"));
      }
      return {
        map: map,
        param: evtData.param
      };
    };

    RouteProcessor.prototype.getModelAttr = function(model, attr) {
      var value;
      value = model.get(attr);
      if (!value) {
        return false;
      } else {
        return value;
      }
    };

    RouteProcessor.prototype.getInstance = function() {
      var instance;
      if (!instance) {
        instance = new RouteProcessor();
      }
      return instance;
    };

    return RouteProcessor;

  })();
  routeProcessor = new RouteProcessor();
  routeProcessor = routeProcessor.getInstance();
  return routeProcessor;
});
