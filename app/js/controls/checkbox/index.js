(function() {
  define(["marionette", "hbs!controls/checkbox/checkboxTpl"], function(Marionette, CheckboxTpl) {
    var CheckboxView;
    CheckboxView = Marionette.Layout.extend({
      template: CheckboxTpl,
      initialize: function(options) {
        var self;
        this.context = this.model.get("context");
        self = this;
        console.log("CheckboxView 123", this.model, this.model.get("name"));
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

}).call(this);
