define(["jquery", "marionette", "underscore"], function($, Marionette, _) {
  var GlobalEvents, globalEvents;
  GlobalEvents = Marionette.Controller.extend({
    htmlEvents: ['html:click'],
    windowsEvents: ['window:resize'],
    initialize: function() {
      return this.bindGlobalEvents();
    },
    bindGlobalEvents: function() {
      var _this = this;
      $(window).on('resize', function() {
        var sEvents;
        sEvents = _this.joinEven('windowsEvents');
        return _this.trigger(sEvents, {
          width: $(window).width(),
          height: $(window).height()
        });
      });
      return $("html").on('click', function(e) {
        var sEvents;
        sEvents = _this.joinEven('htmlEvents');
        return _this.trigger(sEvents, e);
      });
    },
    addHtmlEvent: function(eventName) {
      return this.htmlEvents.push(eventName);
    },
    removeHtmlEvent: function(eventName) {
      return this.htmlEvents = _.without(this.htmlEvents, eventName);
    },
    joinEven: function(eventGroup) {
      return this[eventGroup].join(' ');
    }
  });
  if (typeof globalEvents === "undefined" || globalEvents === null) {
    return globalEvents = new GlobalEvents();
  }
});
