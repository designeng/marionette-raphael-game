define(["marionette"], function(Marionette) {
  var ListController;
  ListController = Marionette.Controller.extend({
    initialize: function(options) {},
    onRender: function(str) {
      return console.log("@_currentItemIndex", this._currentItemIndex);
    },
    onShow: function() {
      return console.log("controller onShow");
    },
    onClose: function() {
      console.log("controller onClose");
      return this._items = [];
    },
    onEnter: function(e) {
      return console.log("controller ON ENTER");
    },
    onUp: function(e) {
      return console.log("controller ON UP");
    },
    scrollToElement: function(el) {
      return $(el).ScrollTo({
        duration: 100,
        callback: function() {
          return console.log("scrolled");
        }
      });
    }
  });
  return ListController;
});
