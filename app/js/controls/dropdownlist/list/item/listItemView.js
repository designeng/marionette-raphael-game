define(["marionette"], function(Marionette) {
  var ListItemView;
  ListItemView = Marionette.ItemView.extend({
    template: "{{data}}",
    className: "dropDownListItem",
    tagName: "li",
    events: {
      "click": "onClick",
      "mouseover": "onOver"
    },
    initialize: function(options) {
      return _.bindAll(this, "onOver");
    },
    onBeforeRender: function() {
      return this.eventBus = Marionette.getOption(this, "eventBus");
    },
    onRender: function() {
      return this.$el.css("height", this.model.get("itemHeight"));
    },
    onClick: function() {
      console.log("clicked");
      return this.eventBus.trigger("select", {
        model: this.model
      });
    },
    onOver: function() {
      return this.trigger("over");
    },
    hightLight: function(hClass) {
      return this.$el.addClass(hClass);
    },
    unHightLight: function(hClass) {
      return this.$el.removeClass(hClass);
    }
  });
  return ListItemView;
});
