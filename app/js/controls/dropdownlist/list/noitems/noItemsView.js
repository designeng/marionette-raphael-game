define(["marionette"], function(Marionette) {
  var NoItemsView;
  return NoItemsView = Marionette.ItemView.extend({
    template: "{{noItemsMessage}}",
    tagName: "li",
    className: function() {
      return this.defaultClassName("dropDownListItem--noItem");
    },
    events: {
      "click": "onClick"
    },
    onClick: function() {
      this.eventBus = Marionette.getOption(this, "eventBus");
      return this.eventBus.trigger("select", {
        model: "empty"
      });
    }
  });
});
