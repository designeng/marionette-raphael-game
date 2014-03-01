define(["marionette", "inputTextControl"], function(Marionette, InputTextControl) {
  var ComboboxInputView;
  return ComboboxInputView = InputTextControl.extend({
    initialize: function(options) {
      InputTextControl.prototype.initialize.call(this);
      this.eventBus = Marionette.getOption(this, "eventBus");
      return console.log(this.model);
    },
    onFocus: function(e) {
      return InputTextControl.prototype.onFocus.call(this);
    }
  });
});
