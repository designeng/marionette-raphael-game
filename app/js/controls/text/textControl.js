define(["marionette", "Handlebars"], function(Marionette, Handlebars) {
  var TextControlView;
  return TextControlView = Marionette.Layout.extend({
    template: "{{safeText text}}",
    className: function() {
      return this.defaultClassName("textControl");
    },
    events: {
      "click": "onClick",
      "mouseover": "onOver"
    },
    initialize: function(options) {
      return this.applyModelProperties(["itemHeight", "itemClassName"], {
        prefix: this._attrPrefix
      });
    },
    onBeforeRender: function() {
      if (this._itemHeight) {
        this.$el.css("height", this._itemHeight);
      }
      if (this._itemClassName) {
        return this.$el.attr("class", this._itemClassName);
      }
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
});
