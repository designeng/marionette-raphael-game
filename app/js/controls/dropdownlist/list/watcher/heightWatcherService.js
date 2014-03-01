define(["marionette"], function(Marionette) {
  var HeightWatcherService;
  return HeightWatcherService = Marionette.Controller.extend({
    collectionLength: 0,
    initialize: function() {
      var _this = this;
      this.rootElement = Marionette.getOption(this, "rootElement");
      this.eventBus = Marionette.getOption(this, "eventBus");
      this.heightWatchStream = Marionette.getOption(this, "heightWatchStream");
      this.collectionStream = Marionette.getOption(this, "collectionStream");
      this.collectionStream.onValue(function(val) {
        return _this.collectionLength = val.length;
      });
      return this.heightWatchStream.onValue(function(heightWatchObject) {
        return _this.correctHeight(heightWatchObject);
      });
    },
    correctHeight: function(heightWatchObject) {
      var count, height, itemHeight, itemsToShow, maxItemsToShow;
      count = heightWatchObject.itemsCount;
      itemHeight = heightWatchObject.itemHeight;
      maxItemsToShow = heightWatchObject.maxItemsToShow;
      if (maxItemsToShow && count > maxItemsToShow) {
        itemsToShow = maxItemsToShow;
      } else if (count > this.collectionLength) {
        itemsToShow = this.collectionLength;
      } else {
        itemsToShow = count;
      }
      height = itemsToShow * itemHeight;
      this.setHeight(height);
      return this.eventBus.trigger("mask:height", height);
    },
    setHeight: function(h) {
      return this.rootElement.css("height", h);
    }
  });
});
