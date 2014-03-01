define(["marionette", "linkControl"], function(Marionette, LinkControl) {
  var LinkFooterNavControlView;
  return LinkFooterNavControlView = LinkControl.extend({
    events: {
      "click": "openFooterContacts"
    },
    openFooterContacts: function() {
      this.context.options.context.trigger("openFooterBar:click", {
        model: this.model
      });
      return false;
    }
  });
});
