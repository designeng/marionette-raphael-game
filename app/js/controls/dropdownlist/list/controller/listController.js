define(["backbone", "marionette", "when", "controls/dropdownlist/list/range/rangeService", "controls/dropdownlist/list/scrolling/scrollingService", "controls/dropdownlist/list/watcher/heightWatcherService", "controls/dropdownlist/list/highlight/highLightService"], function(Backbone, Marionette, When, RangeService, ScrollingService, HeightWatcherService, HighLightService) {
  var ListController;
  return ListController = Marionette.Controller.extend({
    initialize: function() {
      var lastIndex,
        _this = this;
      this.eventBus = Marionette.getOption(this, "eventBus");
      this.rootElement = Marionette.getOption(this, "rootElement");
      this.itemHeight = Marionette.getOption(this, "itemHeight");
      this.firstVisible = Marionette.getOption(this, "firstVisible");
      this.defaultMaxItemsToShow = Marionette.getOption(this, "defaultMaxItemsToShow");
      this.setItemsToShow(this.defaultMaxItemsToShow);
      this.collectionProvider = Marionette.getOption(this, "collectionProvider");
      this.highLightClass = Marionette.getOption(this, "highLightClass");
      _.bindAll(this, "passThroughVisibleItemsCountCalculation", "takeHeightWatchObject", "completeHeightWatchObject", "onUp", "onDown", "onHome", "onEnd", "onPageUp", "onPageDown", "onEnter", "onTab", "decrease", "increase", "home", "end", "pageUp", "pageDown", "enter");
      this.eventBus.on("key:up", this.onUp);
      this.eventBus.on("key:down", this.onDown);
      this.eventBus.on("key:home", this.onHome);
      this.eventBus.on("key:end", this.onEnd);
      this.eventBus.on("key:pageup", this.onPageUp);
      this.eventBus.on("key:pagedown", this.onPageDown);
      this.eventBus.on("key:enter", this.onEnter);
      this.eventBus.on("key:tab", this.onTab);
      this.heightWatchStream = this.asEventStream("height:set").map(this.passThroughVisibleItemsCountCalculation).map(this.takeHeightWatchObject).map(this.completeHeightWatchObject);
      this.collectionStream = this.collectionProvider.getCollectionStream();
      this.scrollingService = new ScrollingService({
        eventBus: this.eventBus,
        rangeProvider: this
      });
      this.rangeService = new RangeService({
        eventBus: this.eventBus,
        collectionProvider: this.collectionProvider,
        itemsToShow: this.getItemsToShow()
      });
      if (!this.firstVisible) {
        this.firstVisible = 0;
      } else if (this.firstVisible > (lastIndex = this.collectionProvider.getCollectionLength() - 1)) {
        this.firstVisible = lastIndex;
      }
      this.rangeService.setActive(this.firstVisible);
      this.heightWatcherService = new HeightWatcherService({
        eventBus: this.eventBus,
        rootElement: this.rootElement,
        itemHeight: this.itemHeight,
        collectionStream: this.collectionStream,
        heightWatchStream: this.heightWatchStream
      });
      this.activeDecreaseStream = this.asEventStream("active:decrease").map(this.decrease);
      this.activeIncreaseStream = this.asEventStream("active:increase").map(this.increase);
      this.activeHomeStream = this.asEventStream("active:home").map(this.home);
      this.activeEndStream = this.asEventStream("active:end").map(this.end);
      this.activePageUpStream = this.asEventStream("active:pageup").map(this.pageUp);
      this.activePageDownStream = this.asEventStream("active:pagedown").map(this.pageDown);
      this.activeEnterStream = this.asEventStream("active:enter").map(this.enter);
      this.activeAll = Bacon.mergeAll(this.activeDecreaseStream, this.activeIncreaseStream, this.activeHomeStream, this.activeEndStream, this.activePageUpStream, this.activePageDownStream, this.activeEnterStream).toProperty();
      this.activeAll.onValue(function(index) {
        return _this.eventBus.trigger("range:active:current", index);
      });
      return When(this.collectionProvider.renderPromiseResolved()).then(function(val) {
        _this.highLightService = new HighLightService({
          eventBus: _this.eventBus,
          highLightClass: _this.highLightClass,
          activeStream: _this.rangeService.getActiveStream(),
          itemsProvider: _this.collectionProvider
        });
        return _this.scrollingService.setItemsProvider(_this.collectionProvider).then(function(val) {
          return _this.rangeService.greenRoad.resolve();
        });
      });
    },
    passThroughVisibleItemsCountCalculation: function(height) {
      var itemsCount;
      itemsCount = this.calculateItemsCount(height);
      if (itemsCount < this.defaultMaxItemsToShow) {
        this.setItemsToShow(itemsCount);
      } else {
        this.setItemsToShow(this.defaultMaxItemsToShow);
      }
      this.rangeService.correctLast(itemsCount - 1);
      return itemsCount;
    },
    takeHeightWatchObject: function(itemsCount) {
      var heightWatchObject;
      heightWatchObject = {
        itemsCount: itemsCount,
        itemHeight: this.itemHeight,
        maxItemsToShow: this.getItemsToShow()
      };
      return heightWatchObject;
    },
    completeHeightWatchObject: function(heightWatchObject) {
      heightWatchObject.first = this.rangeService.getFirst();
      heightWatchObject.last = this.rangeService.getLast();
      return heightWatchObject;
    },
    onUp: function() {
      return this.trigger("active:decrease");
    },
    onDown: function() {
      return this.trigger("active:increase");
    },
    onHome: function() {
      return this.trigger("active:home");
    },
    onEnd: function() {
      return this.trigger("active:end");
    },
    onPageUp: function() {
      return this.trigger("active:pageup");
    },
    onPageDown: function() {
      return this.trigger("active:pagedown");
    },
    onEnter: function() {
      return this.trigger("active:enter");
    },
    onTab: function() {
      return this.trigger("active:enter");
    },
    decrease: function() {
      return this.rangeService.activeMinus();
    },
    increase: function() {
      return this.rangeService.activePlus();
    },
    home: function() {
      return this.rangeService.activeHome();
    },
    end: function() {
      return this.rangeService.activeEnd();
    },
    pageUp: function() {
      return this.rangeService.activePageUp();
    },
    pageDown: function() {
      return this.rangeService.activePageDown();
    },
    enter: function() {
      return this.rangeService.activeEnter();
    },
    calculateItemsCount: function(h) {
      var tail;
      tail = h % this.itemHeight;
      if (h - tail === 0) {
        return 1;
      } else {
        return (h - tail) / this.itemHeight;
      }
    },
    setItemsToShow: function(count) {
      return this.itemsToShow = count;
    },
    getItemsToShow: function() {
      return this.itemsToShow;
    }
  });
});
