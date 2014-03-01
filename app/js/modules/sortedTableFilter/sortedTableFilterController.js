var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "when", "baseBlockController", "baseComponent", "core/utils/develop/collectionGenerator", "filterBaseMediator"], function(Marionette, When, BaseBlockController, BaseComponent, collectionGenerator, FilterTableMediator) {
  var SortedTableFilterController, _ref;
  return SortedTableFilterController = (function(_super) {
    __extends(SortedTableFilterController, _super);

    function SortedTableFilterController() {
      _ref = SortedTableFilterController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SortedTableFilterController.prototype.initialize = function(options) {
      this.applyOptions(["region", "declaration"]);
      this.filterTableMediator = this.getFilterTableMediator();
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region
      });
    };

    SortedTableFilterController.prototype.show = function() {
      this.component.show();
      this.fillTableRowsData();
      return this.setTableCollection();
    };

    SortedTableFilterController.prototype.close = function() {
      return this.component.close();
    };

    SortedTableFilterController.prototype.getFilterTableMediator = function() {
      var filterTableMediator;
      return filterTableMediator = new FilterTableMediator;
    };

    SortedTableFilterController.prototype.getTableControl = function() {
      return this.component.getControlByTypeName("tableControl");
    };

    SortedTableFilterController.prototype.fillTableRowsData = function() {
      var fields, modes,
        _this = this;
      modes = {
        mode: "numbers"
      };
      fields = ["data", "nextfield", "somefield"];
      return When(this.getTableControl().isResolved()).then(function(target) {
        return target.callPublic("exposeCollection", _this.getRandomDataCollection());
      });
    };

    SortedTableFilterController.prototype.getRandomDataCollection = function() {
      var fields, modes;
      modes = {
        mode: "numbers"
      };
      fields = ["data", "nextfield", "somefield"];
      return collectionGenerator(5, fields, modes);
    };

    SortedTableFilterController.prototype.setTableCollection = function() {
      var _this = this;
      return When(this.getTableControl().isResolved()).then(function(target) {
        var tableCollection;
        tableCollection = target.callPublic("getCollection");
        return _this.filterTableMediator.setTableCollection(tableCollection);
      });
    };

    SortedTableFilterController.prototype.getFiltedDataModel = function() {
      return filtedDataModel;
    };

    return SortedTableFilterController;

  })(BaseBlockController);
});
