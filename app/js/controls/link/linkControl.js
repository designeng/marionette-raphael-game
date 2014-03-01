define(["marionette", "baseControl"], function(Marionette, BaseControl) {
  var LinkControlView;
  return LinkControlView = BaseControl.extend({
    tagName: "a",
    template: "{{#if icon}}                        <span class='text'>{{loc_text}}</span><img alt='{{loc_text}}' src='{{icon}}' />                    {{else}}                        {{loc_text}}                    {{/if}}",
    events: {
      "click": "onClick",
      "mouseover": "onOver"
    },
    className: function() {
      return this.defaultClassName("link");
    },
    initialize: function(options) {
      this.context = Marionette.getOption(this, "model").get('context');
      this.eventBus = Marionette.getOption(this, "eventBus");
      this.applyModelProperties(["text", "url", "title", "icon", "highlightClass", "preventDefault"], {
        prefix: this._attrPrefix
      });
      return this.translateText();
    },
    translateText: function() {
      var localized;
      localized = this.prepareLocalized(this._text, "string");
      this.model.set("loc_text", localized);
      return localized;
    },
    onBeforeRender: function() {
      this.$el.attr("href", this._url);
      return this.$el.attr("title", this._title);
    },
    onRender: function() {
      return this.isActiveLink();
    },
    onOver: function() {
      return this.trigger("over");
    },
    onClick: function(e) {
      if (this._preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (this.context) {
        this.context.trigger("linkControl:click", {
          text: this.model.get("text")
        });
      }
      this.confirm();
      if (!this._preventDefault) {
        return this.navigateTo(this._url);
      }
    },
    confirm: function() {
      return this;
    },
    navigateTo: function(url) {
      return window.location.hash = url;
    },
    isActiveLink: function() {
      if (this.isActive(window.location.hash)) {
        return this.activate();
      }
    },
    isActive: function(hash) {
      return true && (hash === "#" + this._url) || false;
    },
    activate: function() {
      return this.$el.addClass("active");
    },
    highLight: function(hClass) {
      return this.$el.addClass(hClass);
    },
    unHighLight: function() {
      return this.$el.removeClass(this._highlightClass);
    }
  });
});
