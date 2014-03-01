define(["marionette", "baseControl", "hbs!controls/checkbox/checkboxTpl"], function(Marionette, BaseControl, CheckboxTpl) {
  var CheckboxView;
  CheckboxView = BaseControl.extend({
    template: CheckboxTpl,
    initialize: function(options) {
      var self;
      this.context = Marionette.getOption(this, "context");
      self = this;
      return this.links.each(function(model) {
        var linkId;
        linkId = "link_" + id++;
        self.model.set(linkId, model);
        return self.textToInsert += "<li><div control='linkControl' model='" + linkId + "'/></li>";
      });
    },
    onRender: function() {
      return this.$el.find("ul").html(this.textToInsert);
    }
  });
  return CheckboxView;
});
