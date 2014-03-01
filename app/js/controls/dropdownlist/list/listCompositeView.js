define(["backbone", "marionette", "baseActiveKey", "comboboxListCollection", "controls/dropdownlist/list/item/listItemView", "controls/dropdownlist/list/noitems/noItemsView", "controls/dropdownlist/list/controller/listController", "controls/dropdownlist/list/keyboard/keyboardService", "when", "_.str", "jquery.ScrollTo"], function(Backbone, Marionette, BaseActiveKey, ComboboxListCollection, ListItemView, NoItemsView, ListController, KeyboardService, When) {
  var ListCompositeView;
  ListCompositeView = BaseActiveKey({
    BaseObject: Marionette.CompositeView
  }).extend({
    tagName: "ul",
    itemView: ListItemView,
    emptyView: NoItemsView,
    className: function() {
      return this.defaultClassName("dropDownList");
    },
    initialize: function(options) {
      this.context = this.model.get("context");
      this.eventBus = Marionette.getOption(this, "eventBus");
      this._modelIndex = 0;
      this.renderDefer = When.defer();
      this.applyModelProperties(["width", "itemHeight", "listHeight", "defaultMaxItemsToShow", "itemOverClass", "firstVisible", "itemClassName", "noItemsMessage"], {
        prefix: this._attrPrefix
      });
      if (!this.collection) {
        this.collection = new ComboboxListCollection();
      }
      this.controller = new ListController({
        eventBus: this.eventBus,
        rootElement: this.$el,
        highLightClass: this._itemOverClass,
        itemHeight: this._itemHeight,
        defaultMaxItemsToShow: this._defaultMaxItemsToShow,
        firstVisible: this._firstVisible,
        collectionProvider: this
      });
      this.keyEvents = Marionette.getOption(this, "keyEvents");
      this.keyboardService = new KeyboardService();
      this.keyboardService.extendWithKeyMethods.call(this);
      this._removers = this.keyboardService.bindMethodsToEvents.call(this);
      _.bindAll(this, "onListItemOver", "onListItemClick", "onActiveCurrent", "onActiveEnter");
      this.on("itemview:over", this.onListItemOver);
      this.on("itemview:selected", this.onListItemClick);
      this.eventBus.on("range:active:enter", this.onActiveEnter);
      return this.eventBus.on("range:active:current", this.onActiveCurrent);
    },
    onActiveEnter: function(index) {
      var err;
      try {
        return this.eventBus.trigger("dropdownlist:enter", this.findByIndex(index).model);
      } catch (_error) {
        err = _error;
      }
    },
    onActiveCurrent: function(index) {
      var err;
      try {
        return this.eventBus.trigger("dropdownlist:current", this.findByIndex(index).model);
      } catch (_error) {
        err = _error;
      }
    },
    onBeforeItemAdded: function(view) {
      view.eventBus = this.eventBus;
      this._setProperties(view.model, ["itemHeight", "itemClassName", "modelIndex"]);
      return this._modelIndex++;
    },
    onListItemOver: function(itemview) {
      var index;
      index = itemview.model.get("modelIndex");
      this.eventBus.trigger("dropdownlist:current", itemview.model);
      return this.eventBus.trigger("list:item:over", index);
    },
    onListItemClick: function(itemview) {
      return this.eventBus.trigger("dropdownlist:click", itemview.model);
    },
    onRender: function() {
      this.triggerMethod("before:render:realised");
      if (!this.collection.isEmpty()) {
        this._recalculateDisplayParams();
        this._correctOverFlow();
        this.setHeight(this._listHeight);
        this.eventBus.trigger("");
      }
      this.emptyView.eventBus = this.eventBus;
      return this.renderDefer.resolve(this);
    },
    renderPromiseResolved: function() {
      return this.renderDefer.promise;
    },
    setHeight: function(h) {
      return this.controller.trigger("height:set", h);
    },
    setDefaultMaxItemsToShow: function(count) {
      return this.controller.setDefaultMaxItemsToShow(count);
    },
    _recalculateDisplayParams: function() {
      if (this._defaultMaxItemsToShow > this.getCollectionLength() || !this._defaultMaxItemsToShow) {
        this._defaultMaxItemsToShow = this.getCollectionLength();
      }
      this._listHeight = this._defaultMaxItemsToShow * this._itemHeight;
      this._currentHeight = this._listHeight;
      return this.eventBus.trigger("width", this._width);
    },
    _correctOverFlow: function() {
      var h;
      h = this._itemHeight * this.collection.length;
      if (h > this._listHeight) {
        this.$el.css("overflow-y", "scroll");
      }
      if (h < this._listHeight) {
        return this.$el.css("height", h + "px");
      } else {
        return this.$el.css("height", this._listHeight + "px");
      }
    },
    onShow: function() {
      this._modelIndex = 0;
      return this.keyboardService.bindEvents.call(this);
    },
    findByIndex: function(index) {
      return this.children.findByIndex(index);
    },
    getItem: function(index) {
      return this.children.findByIndex(index);
    },
    getCollectionLength: function() {
      return this.collection.length;
    },
    getCollectionStream: function() {
      return this.collection.getCollectionStream();
    },
    addItemToCollection: function(model) {
      return this.collection.add(model);
    },
    cropCollection: function(itemsCount) {
      var index, _collection, _i;
      _collection = new ComboboxListCollection();
      for (index = _i = 0; 0 <= itemsCount ? _i < itemsCount : _i > itemsCount; index = 0 <= itemsCount ? ++_i : --_i) {
        _collection.add(this.collection.shift());
      }
      return this.collection = _collection;
    },
    resetCollection: function() {
      return this.collection = new ComboboxListCollection();
    },
    setMaskMode: function(mode) {
      return this.eventBus.trigger("mask", mode);
    },
    onBeforeClose: function() {
      var remover, _i, _len, _ref;
      _ref = this._removers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        remover = _ref[_i];
        remover.remove();
      }
      return delete this._removers;
    },
    onClose: function() {
      return this.keyboardService.unBindEvents.call(this);
    },
    _bindKeyEventToMethod: function(methodName) {
      return this[methodName];
    },
    _setProperties: function(obj, attrs) {
      var attr, _i, _len;
      for (_i = 0, _len = attrs.length; _i < _len; _i++) {
        attr = attrs[_i];
        obj.set(attr, this[this._attrPrefix + attr]);
      }
      return obj;
    },
    showEmptyView: function() {
      var EmptyView, model;
      EmptyView = this.getEmptyView();
      if (EmptyView && !this._showingEmptyView) {
        this._showingEmptyView = true;
        model = new Backbone.Model({
          noItemsMessage: this.prepareLocalized(this._noItemsMessage, "string")
        });
        return this.addItemView(model, EmptyView, 0);
      }
    },
    appendHtml: function(collectionView, itemView, index) {
      if (itemView.tagName !== "li") {
        return collectionView.$el.append($("<li></li>").html(itemView.el));
      } else {
        return collectionView.$el.append(itemView.el);
      }
    }
  });
  return ListCompositeView;
});
