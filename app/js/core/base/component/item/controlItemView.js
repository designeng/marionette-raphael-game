define(["backbone", "marionette", "meld", "resolver", "controlContainerService", "core/utils/dom/queryViewForSelector", "_.str"], function(Backbone, Marionette, meld, resolver, controlContainerService, queryViewForSelector) {
  var ControlItemView;
  ControlItemView = Marionette.ItemView.extend({
    setRootClass: function(rootClass) {
      return this.rootClass = rootClass;
    },
    initialize: function() {
      return this.$el.attr(this.attributes);
    },
    onRender: function() {
      var controls,
        _this = this;
      controls = queryViewForSelector(this, "[control]");
      _.each(controls, function(item) {
        var $el, controlName, model, modelLink;
        controlName = $(item).attr("control");
        modelLink = $(item).attr("model");
        $el = $(item);
        if (_.isObject(modelLink)) {
          model = modelLink;
        } else if (_.isString(modelLink)) {
          model = _this.model.get(modelLink);
        }
        return resolver.resolveControl(controlName, function(viewClass) {
          return _this.renderNestedView($el, resolver.resolveControlInstance(viewClass, {
            model: model
          }), model);
        });
      });
      if (this.rootClass) {
        return this.className = this.rootClass;
      }
    },
    renderNestedView: function($el, view, model) {
      var remAfterRender;
      controlContainerService.add(view);
      view.compositeClassName = _.filter(this.rootClass.split(" "), function(name) {
        if (!((name === "" || name === " ") && _.str.endsWith.call(this, name, "__item"))) {
          return name;
        }
      })[0];
      if (view.afterRenderAspect) {
        remAfterRender = meld.after(view, "render", view.afterRenderAspect);
      }
      $el.replaceWith(view.$el);
      return view.render();
    },
    setRootElement: function($el) {
      return this.$el = $el;
    },
    hide: function() {
      return this.$el.hide();
    },
    show: function() {
      return this.$el.show();
    },
    beforeClose: function() {
      var rem, _i, _len, _ref, _results;
      if (this.modelBinder) {
        this.modelBinder.unbind();
      }
      if (this.model.has("__input_instance")) {
        _ref = this.removers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rem = _ref[_i];
          _results.push(rem.remove());
        }
        return _results;
      }
    }
  });
  return ControlItemView;
});
