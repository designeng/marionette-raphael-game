define(["backbone", "marionette", "when", "meld", "hbs!templates/component/default/defaultComponentTpl", "core/base/component/item/itemView", "core/base/component/utils/defineTargetElement"], function(Backbone, Marionette, When, meld, DefaultComponentTpl, ControlItemView, defineTargetElement) {
  var Component, ComponentCompositeView;
  ComponentCompositeView = Marionette.CompositeView.extend({
    template: function() {
      return Marionette.getOption(this, "template");
    },
    className: "CompositeView",
    itemView: ControlItemView,
    itemViewOptions: function(model) {
      var attributes, options;
      attributes = {
        control: model.attributes.controlType,
        model: "controlModel",
        dataModel: model.attributes.dataModel
      };
      options = {};
      options.attributes = attributes;
      options.context = this.context;
      return options;
    },
    beforeInitialize: function() {
      this.model = new Backbone.Model();
      this.declaration = Marionette.getOption(this, "declaration");
      if (this.declaration.componentModel) {
        this.model = this.declaration.componentModel;
        switch (this.model.get("componentType")) {
          case "form":
            return this.isForm = true;
        }
      }
    },
    initialize: function(options) {
      var componentItems, formOptions, item, itemClasses, _i, _inputErrorHandlerCid, _len,
        _this = this;
      this.model.set("cid", this.cid);
      this.renderDefer = Marionette.getOption(this, "renderDefer");
      componentItems = this.declaration.componentItems;
      this.context = Marionette.getOption(this, "context");
      if (this.declaration.componentModel) {
        formOptions = {
          action: this.declaration.componentModel.get("action", {
            dataModel: this.declaration.componentModel.get("dataModel"),
            ajax: this.declaration.componentModel.get("ajax")
          })
        };
        this.context = _.extend(this.context, formOptions);
      }
      if (this.isForm) {
        this.context.validator = {};
      }
      if (this.model.has("inputErrorHandlerCid")) {
        _inputErrorHandlerCid = this.model.get("inputErrorHandlerCid");
        this.context.inputErrorHandlerCid = _inputErrorHandlerCid;
      }
      for (_i = 0, _len = componentItems.length; _i < _len; _i++) {
        item = componentItems[_i];
        if (this.model.has("inputErrorHandlerCid")) {
          item.controlModel.set({
            "inputErrorHandlerCid": _inputErrorHandlerCid
          });
        }
      }
      if (this.declaration.componentModel) {
        this._rootClass = this.declaration.componentModel.get("rootClass");
        itemClasses = this.declaration.componentModel.get("itemClasses");
        if (this._rootClass && itemClasses) {
          this.className = this._rootClass;
          itemClasses = _.map(itemClasses, function(item) {
            return _this._rootClass + "__" + item + " " + _this._rootClass + "__item";
          });
          this.model.set("itemClasses", itemClasses);
        }
      }
      return this.collection = new Backbone.Collection(componentItems);
    },
    onRender: function() {
      var attributes, attrs, extention;
      if (this.isForm) {
        attributes = _.extend({}, _.result(this, 'attributes'));
        extention = {
          'class': this.className,
          "action": this.model.get("action")
        };
        attrs = _.extend(attributes, extention);
        this.$el.attr(attrs);
      }
      return this.renderDefer.resolve(this);
    },
    onAfterItemAdded: function(itemView) {
      return this.context.trigger("component:collection:item:added", itemView);
    },
    appendHtml: function(collectionView, itemView, index) {
      var targetElement;
      targetElement = defineTargetElement.call(this, collectionView, index);
      itemView.setRootClass(targetElement.attr("class"));
      itemView.setRootElement(targetElement);
      return targetElement.append(itemView.el);
    }
  });
  this.remBefore = meld.before(ComponentCompositeView.prototype, "initialize", ComponentCompositeView.prototype.beforeInitialize);
  return Component = Marionette.Controller.extend({
    template: DefaultComponentTpl,
    initialize: function(options) {
      this.setOptions();
      this.renderDefer = When.defer();
      this.layout = new ComponentCompositeView({
        context: this.context,
        template: this.template,
        declaration: this.declaration,
        renderDefer: this.renderDefer
      });
      return this.bindOnItemAdd();
    },
    setOptions: function() {
      this.controlHash = {};
      this.region = Marionette.getOption(this, "region");
      this.context = Marionette.getOption(this, "context");
      this.template = Marionette.getOption(this, "template");
      return this.declaration = Marionette.getOption(this, "declaration");
    },
    bindOnItemAdd: function() {
      _.bindAll(this, "onItemAdded");
      return this.context.on("component:collection:item:added", this.onItemAdded);
    },
    show: function() {
      return this.region.show(this.layout);
    },
    isRendered: function() {
      return this.renderDefer.promise;
    },
    close: function() {
      return this.region.close();
    },
    onItemAdded: function(item) {
      return this.controlHash[item.model.get("controlType")] = item;
    },
    getComposition: function() {
      return this.layout;
    },
    getChildren: function() {
      return this.layout.children;
    },
    getControlByIndex: function(index) {
      return this.getChildren().findByIndex(index);
    },
    getControlByTypeName: function(typeName) {
      return this.controlHash[typeName];
    }
  });
});
