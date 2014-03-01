define(["backbone", "marionette", "baseViewObject", "baseLayoutObject", "baseControllerObject", "backbone.validation"], function(Backbone, Marionette, BaseViewObject, BaseLayoutObject, BaseControllerObject) {
  _.extend(Marionette.View.prototype, BaseViewObject);
  _.extend(Marionette.Layout.prototype, BaseLayoutObject);
  _.extend(Marionette.Controller.prototype, BaseControllerObject);
  _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
  return $.fn.focusNextInputField = function() {
    return this.each(function() {
      var fields, index;
      fields = $(this).parents("form:eq(0),body").find("button,input,textarea,select");
      index = fields.index(this);
      if (index > -1 && (index + 1) < fields.length) {
        fields.eq(index + 1).focus();
      }
      return false;
    });
  };
});
