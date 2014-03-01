define(["marionette", "i18n!nls/general", "core/utils/locale/prepareLocalized"], function(Marionette, localized, prepareLocalized) {
  var BaseControlWrapper;
  return BaseControlWrapper = Marionette.ItemView.extend({
    initialize: function(options) {
      return this.getControlByType(this.model.get("controlType"));
    },
    getControlByType: function(controlType) {
      var _this = this;
      if (controlType) {
        return require([controlType], function(control) {
          return _this.addInnerControl(control);
        });
      }
    },
    addInnerControl: function(controlTypeView) {
      if (!this.model.has("context")) {
        this.model.set({
          "context": this
        });
      }
      this.childView = new controlTypeView({
        model: this.model
      });
      this.childView = _.extend(this.childView, {
        localized: localized,
        prepareLocalized: prepareLocalized
      });
      return this.renderInnerControl(this.childView);
    },
    renderInnerControl: function(view) {
      return this.$el.html(view.render().el);
    }
  });
});
