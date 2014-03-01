var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "marionette", "baseLayout", "controls/table/controller/tableController"], function(Backbone, Marionette, BaseLayout, TableController) {
  var TableBodyRegionType, TableHeaderRegionType, TableView, _ref;
  TableHeaderRegionType = Marionette.Region.extend({
    el: ".tableHeader",
    open: function(view) {
      return this.$el.replaceWith(view.el);
    }
  });
  TableBodyRegionType = Marionette.Region.extend({
    el: ".tableBody",
    open: function(view) {
      return this.$el.replaceWith(view.el);
    }
  });
  return TableView = (function(_super) {
    __extends(TableView, _super);

    function TableView() {
      _ref = TableView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TableView.prototype.template = "<thead class='tableHeader'></thead><tbody class='tableBody'></tbody>";

    TableView.prototype.tagName = "table";

    TableView.prototype.regions = {
      tableHeaderRegion: TableHeaderRegionType,
      tableBodyRegion: TableBodyRegionType
    };

    TableView.prototype.eventBus = _.extend({}, Backbone.Events);

    TableView.prototype.initialize = function() {
      this.context = Marionette.getOption(this, "context");
      this.applyModelProperties(["itemHeight", "itemType", "headerType", "bodyType", "visibleModelFields", "sortableFields", "collection", "collectionStrategy", "headers", "headerClassPrefix", "headerHeight"], {
        prefix: this._attrPrefix
      });
      this.applyDefaults();
      this.resolveClasses();
      _.bindAll(this, "addItemToCollection", "exposeCollection");
      this.context.on("sortedtable:additem", this.addItemToCollection);
      return this.initTableController(this._collection);
    };

    TableView.prototype.initTableController = function(collection) {
      return this.tableController = new TableController({
        collection: collection,
        collectionStrategy: this._collectionStrategy
      });
    };

    TableView.prototype.applyDefaults = function() {
      if (!this._headerClassPrefix) {
        return this._headerClassPrefix = "header_";
      }
    };

    TableView.prototype.initTemplateVariables = function() {
      return this._thead = this.$el.find('thead:first');
    };

    TableView.prototype.getCollection = function() {
      return this.tableController.getCollection();
    };

    TableView.prototype.resolveClasses = function() {
      if (this._itemType) {
        this.itemViewClass = require(this._itemType);
      }
      if (this._headerType) {
        this.headerViewClass = require(this._headerType);
      }
      if (this._bodyType) {
        return this.bodyViewClass = require(this._bodyType);
      }
    };

    TableView.prototype.onBeforeRender = function() {
      return this.createSubViews();
    };

    TableView.prototype.createSubViews = function() {
      if (this._headerType) {
        return this.headerView = new this.headerViewClass({
          eventBus: this,
          columns: this._visibleModelFields,
          tableController: this.tableController,
          headerHeight: this._headerHeight,
          sortableFields: this._sortableFields,
          headers: this._headers,
          headerClassPrefix: this._headerClassPrefix
        });
      }
    };

    TableView.prototype.onExposeCollection = function() {
      if (this._bodyType) {
        this.bodyView = new this.bodyViewClass({
          eventBus: this,
          itemView: this.itemViewClass,
          collection: this.tableController.getCollection(),
          columns: this._visibleModelFields,
          itemHeight: this._itemHeight
        });
      }
      if (this._headerType) {
        this.tableHeaderRegion.show(this.headerView);
      }
      if (this._bodyType) {
        this.tableBodyRegion.show(this.bodyView);
      }
      return this.initTemplateVariables();
    };

    TableView.prototype._setProperties = function(obj, attrs, mapping) {
      var attr, _i, _len;
      for (_i = 0, _len = attrs.length; _i < _len; _i++) {
        attr = attrs[_i];
        if (mapping && mapping[attr]) {
          attr = mapping[attr];
        }
        obj.set(attr, this[this._attrPrefix + attr]);
      }
      return obj;
    };

    TableView.prototype.addItemToCollection = function(item) {
      return this.tableController.addItemToCollection(item);
    };

    TableView.prototype.exposeCollection = function(collection) {
      this.tableController.setCollection(collection);
      return this.triggerMethod("expose:collection");
    };

    TableView.prototype.publicApi = function() {
      return {
        "addItemToCollection": this.addItemToCollection,
        "exposeCollection": this.exposeCollection,
        "getCollection": this.getCollection
      };
    };

    return TableView;

  })(Marionette.Layout);
});
