define(["backbone", "marionette", "baseActiveKey", "globalEvents", "controlContainerService", "inputError", "controls/switch/init/bindKeyMethods", "core/utils/view/applyModelProperties", "core/utils/aspect/defineCommonAspect"], function(Backbone, Marionette, BaseActiveKey, globalEvents, controlContainerService, InputErrorControl, bindKeyMethods, applyModelProperties, defineCommonAspect) {
  var NoItemsView, SwitchControlView, SwitchItemView;
  NoItemsView = Marionette.ItemView.extend({
    template: 'No options'
  });
  SwitchItemView = Marionette.ItemView.extend({
    template: '<input type="radio" name="{{inputName}}"/><label for="{{inputName}}">{{inputNameValue}}</label>',
    className: function() {
      return this.defaultClassName("switchControlItem");
    },
    templateHelpers: {
      inputName: function() {
        var keys, name, _name;
        if (!(name = this.name)) {
          return _.uniqueId("radio_");
        } else {
          if (_.isString(this.name)) {
            _name = this.name;
            this.name = {};
            this.name[_name] = _name;
          }
          keys = _.keys(this.name);
          return keys[0].toLowerCase();
        }
      },
      inputNameValue: function() {
        var keys, name;
        if (!(name = this.name)) {
          return _.uniqueId("radio_") + "_Value";
        } else {
          keys = _.keys(this.name);
          return this.name[keys[0]];
        }
      }
    },
    events: {
      "click": "onClick",
      "focus :input": "onInputFocus",
      "blur :input": "onInputBlur"
    },
    _attrPrefix: "",
    initialize: function() {
      return this.applyModelProperties(["itemSelectedClass", "itemFocusedClass"], {
        prefix: this._attrPrefix
      });
    },
    onRender: function() {
      this.input = this.$el.find("input");
      this.label = this.$el.find("label");
      this.index = this.model.get("index");
      _.bindAll(this, "onInputFocus");
      if (this.index !== 0) {
        this.input.remove();
      }
      return this.$el.addClass("item" + this.index);
    },
    onClick: function() {
      this.check();
      return this.trigger("checked");
    },
    check: function() {
      this.input.attr("checked", "checked");
      this.label.addClass(this.itemSelectedClass);
      return this.label.removeClass(this.itemFocusedClass);
    },
    unCheck: function() {
      this.input.removeAttr("checked");
      this.label.removeClass(this.itemSelectedClass);
      return this.label.removeClass(this.itemFocusedClass);
    },
    onInputFocus: function() {
      if (this.index === 0) {
        this.trigger("infocus", this.index);
      }
      return this.label.addClass(this.itemFocusedClass);
    },
    onInputBlur: function() {
      if (this.index === 0) {
        this.trigger("inblur");
      }
      return this.label.removeClass(this.itemFocusedClass);
    }
  });
  return SwitchControlView = BaseActiveKey({
    BaseObject: Marionette.CompositeView
  }).extend({
    className: function(res) {
      return this.defaultClassName("switchControl");
    },
    itemView: SwitchItemView,
    emptyView: NoItemsView,
    initialize: function(options) {
      var evt, methodName, remover, _i, _len, _ref,
        _this = this;
      this.context = Marionette.getOption(this, "context");
      this.eventBus = _.extend({}, Backbone.Events);
      applyModelProperties.call(this, this.model, "width", "height", "fontSize", "inputOptions", "itemClassName", "itemFocusedClass", "itemSelectedClass", "showInputs", "startIndex", {
        prefix: this._attrPrefix
      });
      this.collection = new Backbone.Collection();
      this._removers = [];
      this._keyEvents = ["up", "down", "left", "right", "space", "tab"];
      bindKeyMethods.call(this);
      _ref = this._keyEvents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        methodName = this._getMethodName(evt);
        if (!this[methodName]) {
          this[methodName] = function(e) {};
        }
        remover = defineCommonAspect.call(this, methodName, "afterKeyPressed", "after");
        this._removers.push(remover);
      }
      this.on("itemview:checked", this.onItemClick);
      this.on("itemview:infocus", this.onInFocus);
      this.on("itemview:inblur", this.onInBlur);
      this.inFocus = false;
      _.bindAll(this, "onHtmlClick");
      globalEvents.on("html:click", this.onHtmlClick);
      if (this.model.has("inputErrorHandlerCid")) {
        return this.inputError = controlContainerService.findByCid(this.model.get("inputErrorHandlerCid"));
      } else {
        return this.inputError = new InputErrorControl({
          model: new Backbone.Model()
        });
      }
    },
    onBeforeRender: function() {
      var modIndex, option, optionModel, _i, _len, _ref;
      this._inputOptionsPrepared = this.prepareLocalized(this._inputOptions, "object");
      modIndex = 0;
      _ref = this._inputOptionsPrepared;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        optionModel = new Backbone.Model({
          name: option,
          eventBus: this.eventBus,
          itemSelectedClass: this._itemSelectedClass,
          itemFocusedClass: this._itemFocusedClass,
          index: modIndex++
        });
        this.collection.add(optionModel);
      }
      if (this.collection.length) {
        return this.currentIndex = 0;
      }
    },
    onRender: function() {
      var _this = this;
      if (!this._showInputs) {
        this.hideInputs();
      }
      _.each(this._keyEvents, function(evt) {
        return _this.keyOn(evt, _this._bindKeyEventToMethod(_this._getMethodName(evt)));
      });
      this.dataModel = Marionette.getOption(this, "dataModel");
      this.dataModel.bind("validated", function(isValid, model, errors) {
        if (!isValid) {
          return console.log("NOT VALID");
        } else {
          return _this.context.trigger("collect:data", _this.dataModel);
        }
      });
      if (_.isNumber(this._startIndex)) {
        return this.chooseItem(this._startIndex);
      }
    },
    onHtmlClick: function(e) {
      if ($.contains(this.el, e.target)) {
        return this.onInsideClick();
      } else {
        return this.onOutClick();
      }
    },
    hideInputs: function() {
      var _this = this;
      return this.children.each(function(item) {
        if (item.model.get("index") === 0) {
          return item.input.addClass("switchItemInput__hidden");
        } else {
          return item.input.hide();
        }
      });
    },
    onInFocus: function(index) {
      return this.inFocus = true;
    },
    onInBlur: function() {
      return this.inFocus = false;
    },
    onInsideClick: function() {
      return this.inFocus = true;
    },
    onOutClick: function() {
      return this.inFocus = false;
    },
    onItemClick: function(itemview) {
      this.inFocus = true;
      this.currentIndex = itemview.model.get("index");
      return this.chooseItem(this.currentIndex);
    },
    afterKeyPressed: function(key) {
      if (!this.inFocus) {
        return;
      }
      if (key === "space") {
        this.chooseItem(this.currentIndex);
      }
      if (key === "left" || key === "up") {
        this.choosePrevious();
      }
      if (key === "down" || key === "right") {
        return this.chooseNext();
      }
    },
    choosePrevious: function() {
      if (this.currentIndex > 0) {
        return this.chooseItem(--this.currentIndex);
      }
    },
    chooseNext: function() {
      if (this.currentIndex < this.collection.length - 1) {
        return this.chooseItem(++this.currentIndex);
      }
    },
    chooseItem: function(index) {
      var item;
      if (_.isNumber(this.checkedItemIndex)) {
        this.children.findByIndex(this.checkedItemIndex).unCheck();
      }
      item = this.children.findByIndex(index);
      item.check();
      this.checkedItemIndex = index;
      this.dataModel.set("name", this.model.get("name"));
      this.dataModel.set("data", _.keys(item.model.get("name"))[0]);
      this.context.trigger("collect:data", this.dataModel);
      this.context.trigger("switch:selected", this.dataModel.get("data"));
      return item;
    },
    onClose: function() {
      var _this = this;
      return _.each(this._keyEvents, function(evt) {
        return _this.keyOff(evt);
      });
    },
    _getMethodName: function(string) {
      return "on" + _.str.classify.call(this, string);
    },
    _bindKeyEventToMethod: function(methodName) {
      return this[methodName];
    }
  });
});
