define(["marionette"], function(Marionette) {
  var HighLightService;
  return HighLightService = Marionette.Controller.extend({
    indexHighLighted: -1,
    initialize: function() {
      var _this = this;
      this.eventBus = Marionette.getOption(this, "eventBus");
      this.highLightClass = Marionette.getOption(this, "highLightClass");
      this.activeStream = Marionette.getOption(this, "activeStream");
      this.itemsProvider = Marionette.getOption(this, "itemsProvider");
      return this.activeStream.onValue(function(active) {
        return _this.highLight(active);
      });
    },
    highLight: function(index) {
      var err, item;
      item = this.getItemByIndex(index);
      try {
        if (this.indexHighLighted >= 0) {
          this.unHighLight(this.indexHighLighted);
        }
        item.highLight(this.highLightClass);
        return this.indexHighLighted = index;
      } catch (_error) {
        err = _error;
        return console.log("Something wrong... may be " + item + " with index " + index + " and class " + _.result(item, "className") + " has not method highLight");
      }
    },
    unHighLight: function(index) {
      return this.getItemByIndex(index).unHighLight(this.highLightClass);
    },
    getItemByIndex: function(index) {
      var e, item;
      try {
        item = this.itemsProvider.getItem(index);
        return item;
      } catch (_error) {
        e = _error;
        return null;
      }
    },
    setIndexHighLighted: function(index) {
      return this.indexHighLighted = index;
    }
  });
});
