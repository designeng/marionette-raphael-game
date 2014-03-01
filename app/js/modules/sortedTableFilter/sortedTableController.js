var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "when", "baseComponent", "core/utils/develop/collectionGenerator"], function(Marionette, When, BaseComponent, collectionGenerator) {
  var SortedTableController, _ref;
  return SortedTableController = (function(_super) {
    __extends(SortedTableController, _super);

    function SortedTableController() {
      _ref = SortedTableController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SortedTableController.prototype.initialize = function(options) {
      this.applyOptions(["region", "declaration"]);
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region
      });
    };

    SortedTableController.prototype.show = function() {
      this.component.show();
      return this.triggerMethod("show");
    };

    SortedTableController.prototype.onShow = function() {
      var _this = this;
      console.log("onShow");
      return When(this.component.getControlByTypeName("tableControl").isResolved()).then(function(target) {
        var item;
        target.callPublic("exposeCollection", collectionGenerator(7, ["data", "nextfield", "somefield"], {
          mode: "numbers"
        }));
        item = new Backbone.Model({
          data: "22222_new",
          nextfield: "33333_new",
          somefield: "44444_new"
        });
        return target.callPublic("addItemToCollection", item);
      });
    };

    SortedTableController.prototype.close = function() {
      return this.component.close();
    };

    return SortedTableController;

  })(Marionette.Controller);
});
