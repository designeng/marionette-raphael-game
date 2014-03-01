define(["underscore", "marionette", "vent", "when", "moduleHash", "core/ioc/startComponentInRegion"], function(_, Marionette, vent, When, moduleHash, startComponentInRegion) {
  var ModuleWrapperView, ModuleWrapperViewModel, RegionCollectionView;
  ModuleWrapperViewModel = Backbone.Model.extend({
    initialize: function(options) {
      return this.on("change:status", this.onChange);
    },
    onChange: function() {}
  });
  ModuleWrapperView = Marionette.ItemView.extend({
    className: "moduleWrapper",
    initialize: function(options) {
      var promise, reject, success;
      this.name = this.model.get("name");
      promise = startComponentInRegion.call(this, this.name, new Backbone.Marionette.Region({
        el: this.$el
      }));
      success = function(moduleObject) {
        return moduleHash.addModule(moduleObject);
      };
      reject = function(name) {
        return vent.trigger("module:not:exists", name);
      };
      When(promise, success, reject);
      _.bindAll(this, "onModelStatusChanged");
      return this.model.on("change:status", this.onModelStatusChanged);
    },
    onRender: function() {
      return this.$el.attr("data-name", this.name);
    },
    onModelStatusChanged: function() {
      var status;
      status = this.model.get("status");
      if (status === "open") {
        return this.showView();
      } else if (status === "shut") {
        return this.closeView();
      }
    },
    showView: function() {
      if (this.controller['onShow'] !== void 0) {
        this.controller.onShow();
      }
      return this.$el.show('slow');
    },
    closeView: function() {
      if (this.controller['onHide'] !== void 0) {
        this.controller.onHide();
      }
      return this.$el.hide('slow');
    }
  });
  RegionCollectionView = Marionette.CollectionView.extend({
    itemView: ModuleWrapperView,
    initialize: function(options) {
      return this.collection = new Backbone.Collection();
    },
    processConfig: function(config) {
      var model, modelSet, modelSetToCheck, name, _i, _j, _len, _len1, _ref, _ref1;
      if (!config.open) {
        return "No elements - close all if they were opened";
      }
      _ref = config.open;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (name) {
          modelSetToCheck = this.collection.where({
            name: name
          });
          if (!modelSetToCheck[0]) {
            model = new ModuleWrapperViewModel({
              name: name,
              status: "open"
            });
            this.collection.add(model);
          } else if (modelSetToCheck[0].get("status") === "shut") {
            modelSetToCheck[0].set("status", "open");
          }
        }
      }
      _ref1 = config.shut;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        if (name) {
          modelSet = this.collection.where({
            name: name
          });
          if (modelSet.length) {
            modelSet[0].set({
              "status": "shut"
            });
          }
        }
      }
      return this.collection.models;
    }
  });
  return Marionette.Layout.extend({
    template: "",
    className: "pageLayout",
    regions: {},
    initialize: function(options) {
      var _this = this;
      this.regionSet = {};
      this.rm = this.regionManager;
      this.rm.on("region:add", function(name, region) {
        _this.regionSet[name] = {
          region: null,
          view: null
        };
        _this.regionSet[name].region = region;
        _this.regionSet[name].view = new RegionCollectionView();
        return _this.regionSet[name].view.setElement(region.el);
      });
      return vent.on("module:not:exists", function(name) {
        var replacingElement, targetElement;
        replacingElement = _this.$el.find("[data-name='" + name + "']");
        targetElement = _this.$el.find("#" + name);
        return replacingElement.replaceWith(targetElement);
      });
    },
    processPageStructure: function(pageStructure) {
      var item, _results;
      _results = [];
      for (item in pageStructure) {
        if (!this.regionSet[item]) {
          $("<div id='" + item + "'></div>").appendTo(this.el);
          this.rm.addRegion(item, '#' + item);
        }
        _results.push(this.reorganizeBlocksInRegion(item, this.rm.get(item), pageStructure[item]));
      }
      return _results;
    },
    reorganizeBlocksInRegion: function(item, region, config) {
      var regionView;
      regionView = this.regionSet[item].view;
      return regionView.processConfig(config);
    }
  });
});
