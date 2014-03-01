define(["marionette", "when"], function(Marionette, When) {
  var FirstActiveLast, RangeService;
  FirstActiveLast = Backbone.Model.extend({
    initialize: function() {
      var _this = this;
      this.changed = this.asEventStream("add change").map(this).toProperty();
      this.active = this.changed.map(function() {
        return _this.get("active");
      });
      return this.active.onValue(function(v) {
        return _this._active = v;
      });
    },
    setFirst: function(val) {
      return this.set("first", val);
    },
    setActive: function(val) {
      return this.set("active", val);
    },
    setLast: function(val) {
      return this.set("last", val);
    },
    getFirst: function() {
      return this.get("first");
    },
    getActive: function() {
      return this.get("active");
    },
    getLast: function() {
      return this.get("last");
    }
  });
  return RangeService = Marionette.Controller.extend({
    initialize: function() {
      var _this = this;
      this.eventBus = Marionette.getOption(this, "eventBus");
      this.collectionProvider = Marionette.getOption(this, "collectionProvider");
      this.itemsToShow = Marionette.getOption(this, "itemsToShow");
      this.greenRoad = When.defer();
      this.falst = new FirstActiveLast();
      this.falst.active.onValue(function(active) {
        var first, last, range;
        range = _this.getRange();
        first = _this.getFirst();
        last = _this.getLast();
        if (first === void 0 || last === void 0) {
          _this.setFirst(0);
          _this.setLast(_this.itemsToShow);
          return;
        }
        if (active > last) {
          _this.setLast(last + range);
          _this.setFirst(last);
          _this.eventBus.trigger("mask:show");
          When(_this.greenRoadResolved()).then(function(v) {
            return _this.eventBus.trigger("scroll:to", active);
          });
          return;
        }
        if (active < first) {
          _this.setFirst(active);
          _this.setLast(active + range);
          _this.eventBus.trigger("mask:show");
          When(_this.greenRoadResolved()).then(function(v) {
            return _this.eventBus.trigger("scroll:to", active);
          });
        }
      });
      _.bindAll(this, "setActive");
      return this.eventBus.on("list:item:over", this.setActive);
    },
    setFirst: function(index) {
      return this.falst.setFirst(index);
    },
    setLast: function(index) {
      return this.falst.setLast(index);
    },
    setActive: function(index) {
      return this.falst.setActive(index);
    },
    getFirst: function() {
      return this.falst.getFirst();
    },
    getLast: function() {
      return this.falst.getLast();
    },
    getActive: function() {
      return this.falst.getActive();
    },
    getActiveStream: function() {
      return this.falst.active;
    },
    activeEnter: function() {
      var active;
      active = this.getActive();
      this.eventBus.trigger("range:active:enter", active);
      return active;
    },
    activeMinus: function() {
      if (this.getActive() > 0) {
        this.setActive(this.getActive() - 1);
      }
      return this.getActive();
    },
    activePlus: function() {
      if (this.getActive() < this.getLastIndex()) {
        this.setActive(this.getActive() + 1);
      }
      return this.getActive();
    },
    activePageUp: function() {
      var active, range;
      range = this.getRange();
      active = this.getActive() - range;
      if (active > 0) {
        this.setActive(active);
      } else {
        this.setActive(0);
      }
      return this.getActive();
    },
    activePageDown: function() {
      var active, range;
      range = this.getRange();
      active = this.getActive() + range;
      if (active < this.getLastIndex()) {
        this.setActive(active);
      } else {
        this.setActive(this.getLastIndex());
      }
      return this.getActive();
    },
    activeHome: function() {
      this.setActive(0);
      return 0;
    },
    activeEnd: function() {
      this.setActive(this.getLastIndex());
      return this.getActive();
    },
    getRange: function() {
      var range;
      range = this.getLast() - this.getFirst();
      return range;
    },
    getLastIndex: function() {
      return this.collectionProvider.getCollectionLength() - 1;
    },
    correctLast: function(range) {
      return this.setLast(this.getFirst() + range);
    },
    greenRoadResolved: function() {
      return this.greenRoad.promise;
    }
  });
});
