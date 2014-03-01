define(["marionette", "modelbinder"], function(Marionette) {
  var SimpleTplView;
  SimpleTplView = Marionette.ItemView.extend({
    className: function() {
      if (this.model) {
        return this.model.get("className");
      }
    },
    initialize: function() {
      this.applyModelProperties(["tplModel", "bindings"], {
        prefix: this._attrPrefix
      });
      return this.template = this.model.get('tpl');
    },
    onBeforeRender: function() {
      if (this._tplModel) {
        this._tplModel = this.prepareTemplateFields(this._tplModel);
        if (!this._bindings) {
          return this.template = this.template({
            tplModel: this._tplModel.toJSON()
          });
        }
      }
    },
    onRender: function() {
      if (this._bindings) {
        this.modelBinder = new Backbone.ModelBinder();
        return this.modelBinder.bind(this._tplModel, this.el, this._bindings);
      }
    },
    prepareTemplateFields: function(model) {
      var attr, localizedValue, newModel, value;
      newModel = new Backbone.Model();
      if (model.attributes) {
        for (attr in model.attributes) {
          value = model.attributes[attr];
          localizedValue = this.prepareLocalized(value, "string");
          newModel.set(attr, localizedValue);
        }
      }
      return newModel;
    },
    setTemplateField: function(attribute, value) {
      value = this.prepareLocalized(value, "string");
      return this._tplModel.set(attribute, value);
    },
    publicApi: function() {
      return {
        "setTemplateField": this.setTemplateField
      };
    }
  });
  return SimpleTplView;
});
