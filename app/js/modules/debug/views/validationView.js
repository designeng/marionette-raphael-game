(function() {
  define(["marionette", "jquery", "hbs!templates/modules/debug/validationViewTpl"], function(Marionette, $, validationViewTpl) {
    var BasicView;
    BasicView = Marionette.ItemView.extend({
      template: validationViewTpl,
      events: {
        "click #submit": "submit"
      },
      initialize: function(options) {
        return console.log("MODEL", this.model);
      },
      onRender: function() {
        return this.model.on('validated:valid', this.valid, this);
      },
      valid: function(obj) {
        return console.log("VALID", obj);
      },
      submit: function(e) {
        var data;
        e.preventDefault();
        this.model.validate();
        if (this.model.isValid()) {
          alert("OK!");
        }
        this.$(".alert").hide();
        data = this.$("form").serializeObject();
        if (this.model.set(data)) {
          return this.$(".alert-success").fadeIn();
        } else {
          return this.$(".alert-error").fadeIn();
        }
      }
    });
    return BasicView;
  });

}).call(this);
