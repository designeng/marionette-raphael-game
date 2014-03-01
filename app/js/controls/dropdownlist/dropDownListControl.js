define(["backbone", "marionette", "controls/dropdownlist/mask/maskService", "controls/dropdownlist/dropdown/dropDownService", "controls/dropdownlist/report/reportingService", "core/utils/develop/collectionGenerator"], function(Backbone, Marionette, MaskService, DropDownService, ReportingService, collectionGenerator) {
  var DropDownListView;
  return DropDownListView = Marionette.Layout.extend({
    template: "<div class='listContainer'></div><div class='dropDownListMask'></div>",
    events: {
      "click .dropDownListMask": "clickMask"
    },
    regions: {
      dropDownRegion: ".listContainer",
      maskRegion: ".dropDownListMask"
    },
    className: function() {
      return this.defaultClassName("dropDownListHolder");
    },
    initialize: function(options) {
      this.context = Marionette.getOption(this, "context");
      this.applyModelProperties(["collection", "stayOpen", "itemType"], {
        prefix: this._attrPrefix
      });
      this._keyEvents = ["enter", "down", "up", "home", "end", "page_up", "page_down", "tab", "space", "backspace", "esc"];
      this.initEventBus();
      if (!this.collection) {
        this.collection = this._collection;
      }
      this.maskService = new MaskService({
        eventBus: this.eventBus
      });
      this.dropDownService = new DropDownService({
        eventBus: this.eventBus,
        itemType: this._itemType,
        keyEvents: this._keyEvents
      });
      return this.reportingService = new ReportingService({
        context: this.context,
        eventBus: this.eventBus,
        maskService: this.maskService,
        dropDownService: this.dropDownService
      });
    },
    initEventBus: function() {
      _.bindAll(this, "onMaskShow", "setMaskHeight");
      this.eventBus = _.extend({}, Backbone.Events);
      this.eventBus.on("mask:show", this.onMaskShow);
      return this.eventBus.on("mask:height", this.setMaskHeight);
    },
    onRender: function() {
      this.maskService.renderInRegion(this.maskRegion);
      this.maskService.setMaskStatus("hide");
      this.dropDownService.initDropDownView({
        model: this.model,
        collection: this.collection
      });
      return this.dropDownService.renderInRegion(this.dropDownRegion);
    },
    clickMask: function() {
      return this.reportingService.onMaskClicked();
    },
    onMaskShow: function() {
      return this.maskService.setMaskStatus("show");
    },
    setMaskHeight: function(height) {
      return this.maskService.setMaskHeight(height);
    },
    setHeight: function(h) {
      return this.dropDownService.setHeight(h);
    },
    setDefaultMaxItemsToShow: function(count) {
      return this.dropDownService.setDefaultMaxItemsToShow(count);
    },
    addItemToCollection: function(model) {
      return this.dropDownService.addItemToCollection(model);
    },
    cropCollection: function(itemsCount) {
      return this.dropDownService.cropCollection(itemsCount);
    },
    resetCollection: function() {
      return this.dropDownService.resetCollection();
    },
    publicApi: function() {
      return {
        "setHeight": this.setHeight,
        "addItemToCollection": this.addItemToCollection,
        "cropCollection": this.cropCollection,
        "resetCollection": this.resetCollection,
        "setDefaultMaxItemsToShow": this.setDefaultMaxItemsToShow
      };
    }
  });
});
