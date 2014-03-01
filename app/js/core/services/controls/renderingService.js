define(["backbone", "marionette", "meld", "globalEvents"], function(Backbone, Marionette, meld, globalEvents) {
  var RenderingService, RsRegion, renderingService;
  RsRegion = Marionette.Region.extend({
    initialize: function() {
      return this.el = Marionette.getOption(this, "el");
    }
  });
  RenderingService = Marionette.Controller.extend({
    hash: {},
    initialize: function() {
      _.bindAll(this, "afterViewRenderAspect", "onHtmlClick");
      meld.after(Marionette.Layout.prototype, "render", this.afterViewRenderAspect);
      return globalEvents.on("html:click", this.onHtmlClick);
    },
    afterViewRenderAspect: function(layout) {
      var innerComponent;
      if (!layout.model) {
        return;
      }
      if (innerComponent = layout.model.get("innerComponent")) {
        if (innerComponent.connectTo) {
          this.createConnection(layout, innerComponent.connectTo);
        }
        this.defineRegion(layout);
        this.hash[layout.cid] = this.registerInnerComponent(layout, innerComponent);
        if (innerComponent.buffer) {
          return this.processBuffer(layout, innerComponent.buffer);
        }
      }
    },
    createConnection: function(layout, methodToConnect) {
      var showInnterContent,
        _this = this;
      if (!layout.removers) {
        layout.removers = [];
      }
      showInnterContent = function() {
        return _this.showInner(layout.cid);
      };
      return layout.removers.push(meld.after(layout, methodToConnect, showInnterContent));
    },
    requireClass: function(type) {
      return require(type);
    },
    registerInnerComponent: function(layout, innerComponent) {
      var hashObject, innerComponentClass, rsRegion, view;
      rsRegion = layout.regionManager.get("rsRegion");
      innerComponentClass = this.requireClass(innerComponent.innerComponentType);
      view = new innerComponentClass({
        model: innerComponent.model
      });
      hashObject = {
        layout: layout,
        region: rsRegion,
        view: view,
        behaviour: innerComponent.behaviour
      };
      return hashObject;
    },
    processBuffer: function(layout, buffer) {
      var bufferFunctions, key, keys, mapper, _i, _len, _results,
        _this = this;
      keys = _.keys(buffer);
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        bufferFunctions = buffer[key];
        if (key === "layout") {
          mapper = function(func) {
            return func.call(_this, layout);
          };
        } else if (key === "view") {
          mapper = function(func) {
            return func.call(_this, _this.getCorrespondentView(layout));
          };
        }
        _results.push(_.map(bufferFunctions, mapper));
      }
      return _results;
    },
    getRegion: function(layout) {
      return this.hash[layout.cid].region;
    },
    getCorrespondentView: function(layout) {
      return this.hash[layout.cid].view;
    },
    showInner: function(cid) {
      var behaviour, region, view;
      region = this.hash[cid].region;
      view = this.hash[cid].view;
      behaviour = this.hash[cid].behaviour;
      if (!this.hash[cid].status) {
        this.hash[cid].status = -1;
      }
      if (this.hash[cid].status < 0) {
        if (region.currentView !== view) {
          region.show(view);
        }
      } else {
        region.close();
      }
      if (behaviour && behaviour.toggle) {
        this.hash[cid].status *= -1;
      }
      if (this.currentActiveCid && this.currentActiveCid !== cid) {
        this.closeCurrentActive();
        this.currentActiveCid = cid;
      }
      if (cid && !this.currentActiveCid) {
        return this.currentActiveCid = cid;
      }
    },
    closeCurrentActive: function() {
      var behaviour;
      behaviour = this.hash[this.currentActiveCid].behaviour;
      if (behaviour && behaviour.closeWithOuterClick) {
        this.hash[this.currentActiveCid].region.close();
        return this.hash[this.currentActiveCid].status = -1;
      }
    },
    onHtmlClick: function() {
      if (!this.currentActiveCid) {

      } else {
        this.closeCurrentActive();
        return this.currentActiveCid = void 0;
      }
    },
    defineRegion: function(layout) {
      var layoutCid, rsRegion;
      layoutCid = layout.cid;
      layout.$el.append("<div class='" + layoutCid + "_rsRegion'></div>");
      rsRegion = new RsRegion({
        el: "." + ("" + layoutCid + "_rsRegion")
      });
      return layout.addRegion("rsRegion", rsRegion);
    }
  });
  if (typeof renderingService === "undefined" || renderingService === null) {
    return renderingService = new RenderingService();
  }
});
