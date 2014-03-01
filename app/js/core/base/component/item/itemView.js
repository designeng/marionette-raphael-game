define(["backbone", "marionette", "when", "function", "meld", "resolver", "controlContainerService", "core/utils/dom/queryViewForSelector", "_.str"], function(Backbone, Marionette, When, fn, meld, resolver, controlContainerService, queryViewForSelector) {
  var ControlItemView;
  ControlItemView = Marionette.ItemView.extend({
    _publicApi: null,
    setRootClass: function(rootClass) {
      return this.rootClass = rootClass;
    },
    initialize: function() {
      this.$el.attr(this.attributes);
      this.context = Marionette.getOption(this, "context");
      this.dataModel = this.model.get("dataModel");
      this.apiDefer = When.defer();
      return this.isResolvedDefer = When.defer();
    },
    onRender: function() {
      var controls,
        _this = this;
      controls = queryViewForSelector(this, "[control]");
      _.each(controls, function(item) {
        var $el, controlType, model, modelLink;
        controlType = $(item).attr("control");
        modelLink = $(item).attr("model");
        $el = $(item);
        if (_.isObject(modelLink)) {
          model = modelLink;
        } else if (_.isString(modelLink)) {
          model = _this.model.get(modelLink);
        }
        return resolver.resolveControl(controlType, function(viewClass) {
          _this.processNestedView($el, resolver.resolveControlInstance(viewClass, {
            model: model,
            dataModel: _this.dataModel,
            context: _this.context
          }));
          return _this.isResolvedDefer.resolve(_this);
        });
      });
      if (this.rootClass) {
        return this.className = this.rootClass;
      }
    },
    commonAfterRenderAspect: function() {
      var context;
      context = Marionette.getOption(this, "context");
      return context.trigger("component:control:rendered", this);
    },
    processNestedView: function($el, view, model) {
      var remCommonAfterRender;
      this.providePublicApi(view);
      controlContainerService.add(view);
      this.defineCompositeClassName(view);
      remCommonAfterRender = meld.after(view, "render", this.commonAfterRenderAspect);
      $el.replaceWith(view.$el);
      return view.render();
    },
    providePublicApi: function(view) {
      if (view["publicApi"]) {
        this._publicApi = {
          target: view,
          api: _.result(view, "publicApi")
        };
        return this.apiDefer.resolve(this._publicApi);
      }
    },
    getPublicApi: function(test) {
      return this.apiDefer.promise;
    },
    isResolved: function() {
      return this.isResolvedDefer.promise;
    },
    callPublic: function(funcName) {
      var data;
      data = Array.prototype.slice.call(arguments);
      data = _.rest(data);
      if (this._publicApi.api[funcName]) {
        return this._publicApi.api[funcName].apply(this._publicApi.target, data);
      } else {
        return this.isResolvedDefer.reject("some reason");
      }
    },
    defineCompositeClassName: function(view) {
      var compositeClassName;
      if (this.rootClass) {
        compositeClassName = _.filter(this.rootClass.split(" "), function(name) {
          if (!((name === "" || name === " ") && _.str.endsWith.call(this, name, "__item"))) {
            return name;
          }
        })[0];
        view.compositeClassName = compositeClassName;
        return compositeClassName;
      }
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
      if (this.removers) {
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
