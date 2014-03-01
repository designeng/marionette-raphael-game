define(["marionette", "meld", "modelbinder"], function(Marionette, meld) {
  var InputError;
  InputError = Marionette.ItemView.extend({
    template: "<span name='errorText' cid='{{inputErrorHandlerCid}}'>{{errorText}}</span>",
    className: "inputError",
    initialize: function(options) {
      this.modelBinder = new Backbone.ModelBinder();
      if (this.model.has("inputErrorHandlerCid")) {
        this.cid = this.model.get("inputErrorHandlerCid");
      }
      return _.bindAll(this, "show");
    },
    onRender: function() {
      if (this.model.get("display")) {
        this.show();
      } else {
        this.hide();
      }
      return this.modelBinder.bind(this.model, this.el);
    },
    show: function(errorText) {
      if (errorText) {
        if (_.isObject(errorText) && errorText.data) {
          this.model.set("errorText", errorText.data);
        } else if (_.isString(errorText)) {
          this.model.set("errorText", errorText);
        } else {
          throw new Error("Error data is not defined!");
        }
      } else {
        this.model.set("errorText", "ERROR");
      }
      return this.$el.show("slow");
    },
    hide: function() {
      return this.$el.hide();
    },
    onClose: function() {
      this.modelBinder.unbind();
      return delete this.modelBinder;
    }
  });
  return InputError;
});
