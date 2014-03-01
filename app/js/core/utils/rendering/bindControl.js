define(["backbone", "marionette", "meld", "core/utils/dom/queryViewForSelector", "i18n!nls/general"], function(Backbone, Marionette, meld, queryViewForSelector, localized) {
  var afterRenderFunction, beforeClose, beforeRenderFunction, bindAdditionalAspectsToInstance, bindControl, renderNestedView;
  Backbone.controlContainer = new Backbone.ChildViewContainer();
  renderNestedView = function($el, viewClass, model) {
    var view;
    if ($el.size() === 1) {
      view = new viewClass({
        model: model
      });
      Backbone.controlContainer.add(view);
      bindAdditionalAspectsToInstance(view);
      $el.replaceWith(view.$el);
      if (view.model) {
        return view.render();
      }
    }
  };
  bindAdditionalAspectsToInstance = function(view) {
    view.remBefore = meld.before(view, "render", view.beforeBaseInputRender);
    return view.remAfter = meld.after(view, "render", view.afterBaseInputRender);
  };
  beforeRenderFunction = function(res) {
    if (!this.model) {
      return;
    }
    if (this.model && !this.model.get("thisView")) {
      return this.model.set("thisView", this);
    }
  };
  afterRenderFunction = function(res) {
    var controls,
      _this = this;
    controls = queryViewForSelector(this, "[control]");
    return _.each(controls, function(item) {
      var $el, controlName, model, modelLink, viewClass;
      controlName = $(item).attr("control");
      modelLink = $(item).attr("model");
      $el = $(item);
      if (_.isObject(modelLink)) {
        model = modelLink;
      } else if (_.isString(modelLink)) {
        model = _this.model.get(modelLink);
      }
      viewClass = _this.resolveViewClass(controlName);
      return _this.resolveViewClass(controlName, _.bind(function(viewClass) {
        return renderNestedView($el, viewClass, model);
      }, _this));
    });
  };
  beforeClose = function() {
    var rem, rems, _i, _len, _results;
    if (this.modelBinder) {
      this.modelBinder.unbind();
    }
    if (this.model.has("__input_instance")) {
      rems = [this.remAfter, this.remBefore];
      _results = [];
      for (_i = 0, _len = rems.length; _i < _len; _i++) {
        rem = rems[_i];
        _results.push(rem.remove());
      }
      return _results;
    }
  };
  bindControl = function() {
    meld.before(Marionette.ItemView.prototype, "render", beforeRenderFunction);
    meld.after(Marionette.ItemView.prototype, "render", afterRenderFunction);
    return meld.before(Marionette.ItemView.prototype, "close", beforeClose);
  };
  return bindControl;
});
