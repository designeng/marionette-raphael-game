define(["backbone", "marionette", "when", "controls/dropdownlist/list/listCompositeView"], function(Backbone, Marionette, When, ListCompositeView) {
  var DropDownService;
  return DropDownService = Marionette.Controller.extend({
    initialize: function() {
      this.itemType = Marionette.getOption(this, "itemType");
      if (this.itemType) {
        this.resolveClasses();
      }
      this.eventBus = Marionette.getOption(this, "eventBus");
      this.keyEvents = Marionette.getOption(this, "keyEvents");
      return this.renderDefer = When.defer();
    },
    resolveClasses: function() {
      return this.itemViewClass = require(this.itemType);
    },
    initDropDownView: function(options) {
      var _this = this;
      this.dropDownView = new ListCompositeView({
        model: options.model,
        collection: options.collection,
        eventBus: this.eventBus,
        keyEvents: this.keyEvents
      });
      this.dropDownView.itemViewOptions = {
        eventBus: this.eventBus
      };
      this.dropDownView.itemView = this.itemViewClass;
      return this.dropDownView.onBeforeRenderRealised = function() {
        return _this.renderDefer.resolve(_this.dropDownView);
      };
    },
    renderInRegion: function(region) {
      this.region = region;
      return this.region.show(this.dropDownView);
    },
    closeRegion: function() {
      return this.region.close();
    },
    promiseRendered: function() {
      return this.renderDefer.promise;
    },
    setHeight: function(height) {
      if (this.dropDownView) {
        return this.dropDownView.setHeight(height);
      }
    },
    setDefaultMaxItemsToShow: function(count) {
      if (this.dropDownView) {
        return this.dropDownView.setDefaultMaxItemsToShow(count);
      }
    },
    addItemToCollection: function(model) {
      return this.dropDownView.addItemToCollection(model);
    },
    cropCollection: function(itemsCount) {
      return this.dropDownView.cropCollection(itemsCount);
    },
    resetCollection: function() {
      return this.dropDownView.resetCollection();
    },
    getDropDownView: function() {
      return this.dropDownView;
    }
  });
});
