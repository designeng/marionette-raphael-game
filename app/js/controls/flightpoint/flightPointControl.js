define(["backbone", "marionette"], function(Backbone, Marionette) {
  var FlightPointView;
  return FlightPointView = Marionette.ItemView.extend({
    template: "<div class='airportText'>{{name}}{{#if countryName}},{{/if}}  {{countryName}}  {{cityName}}</div> <div class='codeText'>{{#if codeSirena}}<span class='codeSirena'>{{codeSirena}},</span>{{/if}}{{#if codeIata}} <span class='codeIata'>{{codeIata}}</span>{{/if}}</div>",
    tagName: "li",
    events: {
      "click": "onClick",
      "mouseover": "onOver"
    },
    className: "flightPoint",
    initialize: function(options) {
      return this.eventBus = Marionette.getOption(this, "eventBus");
    },
    onBeforeRender: function() {
      var className, itemHeight;
      if (itemHeight = this.model.get("itemHeight")) {
        this.$el.css("height", itemHeight);
      }
      if (className = this.model.get("className")) {
        this.$el.attr("class", className);
        return;
      }
      if (className = this.model.get("itemClassName")) {
        this.$el.attr("class", className);
      }
    },
    onRender: function() {
      if (this.model.get("type") === "AIRPORT") {
        return this.$el.addClass("flightPointItem--airport");
      }
    },
    onClick: function() {
      return this.trigger("selected");
    },
    onOver: function() {
      return this.trigger("over");
    },
    highLight: function(hClass) {
      return this.$el.addClass(hClass);
    },
    unHighLight: function(hClass) {
      return this.$el.removeClass(hClass);
    }
  });
});
