define(["marionette", "when", "jquery.ScrollTo"], function(Marionette, When) {
  var ScrollingService;
  return ScrollingService = Marionette.Controller.extend({
    initialize: function() {
      this.eventBus = Marionette.getOption(this, "eventBus");
      this.rangeProvider = Marionette.getOption(this, "rangeProvider");
      this.itemsProvider = Marionette.getOption(this, "itemsProvider");
      this.itemsProviderCompleted = When.defer();
      _.bindAll(this, "scrollToIndex");
      return this.eventBus.on("scroll:to", this.scrollToIndex);
    },
    setItemsProvider: function(object) {
      this.itemsProvider = object;
      this.itemsProviderCompleted.resolve();
      return this.itemsProviderCompleted.promise;
    },
    scrollToIndex: function(index) {
      var $el;
      $el = this.getElementByIndex(index);
      return this.scrollToElement($el);
    },
    getElementByIndex: function(index) {
      var e, item;
      try {
        item = this.itemsProvider.getItem(index);
        return item.$el;
      } catch (_error) {
        e = _error;
        return null;
      }
    },
    scrollToElement: function($el) {
      var _this = this;
      return $el.ScrollTo({
        duration: 0,
        callback: function() {}
      });
    }
  });
});
