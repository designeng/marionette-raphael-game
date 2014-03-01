(function() {
  define(["marionette"], function(Marionette) {
    var RangeWatcherService;
    return RangeWatcherService = Marionette.Controller.extend({
      first: 0,
      initialize: function() {
        this.eventBus = Marionette.getOption(this, "eventBus");
        this.itemHeight = Marionette.getOption(this, "itemHeight");
        this.firstVisible = Marionette.getOption(this, "firstVisible");
        this.setItemsToShow(Marionette.getOption(this, "defaultMaxItemsToShow"));
        this.collectionProvider = Marionette.getOption(this, "collectionProvider");
        this.highLightService = Marionette.getOption(this, "highLightService");
        _.bindAll(this, "onHeightSet", "onUp", "onDown", "onHome", "onEnd", "onPageUp", "onPageDown");
        this.eventBus.on("height:set", this.onHeightSet);
        this.eventBus.on("key:up", this.onUp);
        this.eventBus.on("key:down", this.onDown);
        this.eventBus.on("key:home", this.onHome);
        this.eventBus.on("key:end", this.onEnd);
        this.eventBus.on("key:pageup", this.onPageUp);
        this.eventBus.on("key:pagedown", this.onPageDown);
        if (!this.firstVisible) {
          this.firstVisible = 0;
        }
        this.setFirst(this.firstVisible);
        this.setLast(this.firstVisible + this.getItemsToShow() - 1);
        this.setActive(this.firstVisible);
        return this.highLightService.setIndexHighLighted(this.firstVisible);
      },
      onUp: function() {
        var active;
        active = this.getActive();
        if (active > 0) {
          active = active - 1;
          console.log("A", active, "F", this.getFirst(), "L", this.getLast());
          if (active < this.getFirst()) {
            this.eventBus.trigger("scroll:to", active);
            this.setFirst(active);
            this.setLast(active + this.getRange() - 1);
          }
        }
        return this.setActive(active);
      },
      onDown: function() {
        var active, range;
        active = this.getActive();
        if (active < this.getLastIndex()) {
          active = active + 1;
          if (active > this.getLast()) {
            this.eventBus.trigger("scroll:to", active);
            range = this.getRange();
            this.setFirst(active);
            this.setLast(active + range - 1);
          }
        }
        return this.setActive(active);
      },
      onHome: function() {
        var active, range;
        active = 0;
        this.eventBus.trigger("scroll:to", active);
        this.setActive(active);
        range = this.getRange();
        this.setFirst(active);
        return this.setLast(active + range - 1);
      },
      onEnd: function() {
        var active, range;
        active = this.getLastIndex();
        this.eventBus.trigger("scroll:to", active);
        this.setActive(active);
        range = this.getRange();
        this.setFirst(active - range + 1);
        return this.setLast(active);
      },
      onPageUp: function() {},
      onPageDown: function() {
        var active, range;
        active = this.getActive();
        range = this.getRange();
        active = active + range;
        console.log(active, range);
        this.eventBus.trigger("scroll:to", active);
        range = this.getRange();
        this.setFirst(active - range + 1);
        this.setLast(active);
        return console.log("active", this.getActive(), this.getRange(), this.getLast());
      },
      setActive: function(index) {
        this.active = index;
        return this.highLightService.highLight(index);
      },
      getActive: function() {
        return this.active;
      },
      setFirst: function(index) {
        return this.first = index;
      },
      setLast: function(index) {
        return this.last = index;
      },
      getFirst: function() {
        return this.first;
      },
      getLast: function() {
        return this.last;
      },
      getRange: function() {
        return this.last - this.first;
      },
      getLastIndex: function() {
        return this.getLastCollectionIndex();
      },
      getLastCollectionIndex: function() {
        return this.collectionProvider.getCollectionLength() - 1;
      },
      onHeightSet: function(height) {
        this.last = this.first + this.calculateItemsCount(height);
        if (this.last < this.getLastCollectionIndex()) {
          return this.last;
        } else {
          this.last = this.getLastCollectionIndex();
          return this.last;
        }
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
      getCollectionLength: function() {
        return this.collectionProvider.getCollectionLength();
      },
      setItemsToShow: function(count) {
        return this.itemsToShow = count;
      },
      getItemsToShow: function() {
        return this.itemsToShow;
      }
    });
  });

}).call(this);
